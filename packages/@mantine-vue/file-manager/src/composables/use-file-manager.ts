import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  shallowRef,
  toValue,
  unref,
  watch,
  type MaybeRef,
  type MaybeRefOrGetter,
} from 'vue'
import { hasPermission, resolveCapabilities } from '../core/capabilities'
import { FileManagerError, isAbortError, toFileErrorInfo } from '../core/errors'
import { isSafePreviewUrl } from '../core/file-types'
import { matchesFilters, matchesQuery, sortEntries } from '../core/sort-filter'
import {
  mergeFileManagerLabels,
  type FileManagerLabels,
  type FileManagerLabelsOverride,
} from '../labels'
import type {
  FileBulkResult,
  FileConflictStrategy,
  FileDownloadResult,
  FileEntry,
  FileErrorInfo,
  FileFilters,
  FileManagerLocation,
  FilePageResult,
  FileSort,
  FileSortField,
  FileSystemAdapter,
  FileUploadItem,
  FileUploadRestrictions,
} from '../types'
import {
  DEFAULT_CHUNK_SIZE,
  useUploadQueue,
  type FileConflictDecision,
  type FileUploadInput,
} from './use-upload-queue'

/** How long entries stay on the page. */
export type FileManagerPagination = 'none' | 'pages' | 'infinite'

/** Built-in layouts. Custom views use any other string. */
export type FileManagerViewName = 'grid' | 'list' | 'details' | 'gallery' | 'tree' | (string & {})

export type FileSelectionMode = 'replace' | 'toggle' | 'range' | 'add'

/** Operation named in feedback, conflict prompts and confirmations. */
export type FileOperation =
  | 'createFolder'
  | 'rename'
  | 'move'
  | 'copy'
  | 'duplicate'
  | 'delete'
  | 'trash'
  | 'restore'
  | 'emptyTrash'
  | 'star'
  | 'download'
  | 'undo'
  | 'redo'

export interface FileManagerNotice {
  status: 'success' | 'warning' | 'error' | 'info'
  title: string
  message?: string
  operation?: FileOperation
}

export interface FileConfirmRequest {
  kind: 'trash' | 'delete' | 'emptyTrash'
  title: string
  message: string
  confirmLabel: string
  entries: FileEntry[]
}

export interface FileConflictRequest {
  name: string
  existing?: FileEntry
  destination: string
  remaining: number
  operation: 'move' | 'copy' | 'upload'
}

/** Which destructive operations ask for confirmation first. */
export interface FileManagerConfirmOptions {
  trash?: boolean
  delete?: boolean
  emptyTrash?: boolean
}

export interface FileManagerCacheOptions {
  /** Time a listing stays fresh in ms. @default 30000 */
  ttl?: number

  /** Listings kept in memory. @default 50 */
  maxEntries?: number
}

export interface UseFileManagerOptions {
  adapter: MaybeRefOrGetter<FileSystemAdapter>

  /** Folder opened first, `null` for the root. */
  initialFolderId?: string | null

  /** Location opened first. Takes precedence over `initialFolderId`. */
  initialLocation?: FileManagerLocation

  /** @default 'details' */
  initialView?: FileManagerViewName

  initialSort?: FileSort
  initialFilters?: FileFilters
  initialSelection?: string[]

  labels?: MaybeRefOrGetter<FileManagerLabelsOverride | undefined>

  /** Whether folders are listed before files. @default true */
  foldersFirst?: MaybeRefOrGetter<boolean | undefined>

  /** @default 'none' */
  pagination?: MaybeRefOrGetter<FileManagerPagination | undefined>

  /** Entries per page, also requested from the adapter. @default 100 */
  pageSize?: MaybeRefOrGetter<number | undefined>

  /** Listing cache, `false` to always fetch. */
  cache?: MaybeRefOrGetter<FileManagerCacheOptions | false | undefined>

  /** Additional predicate applied to the visible entries. A ref keeps it reactive. */
  entryFilter?: MaybeRef<((entry: FileEntry) => boolean) | undefined>

  /** Whether search includes subfolders. @default true */
  recursiveSearch?: MaybeRefOrGetter<boolean | undefined>

  restrictions?: MaybeRefOrGetter<FileUploadRestrictions | undefined>

  /** Parallel uploads. @default 3 */
  uploadConcurrency?: MaybeRefOrGetter<number | undefined>

  /** Chunk size of chunked uploads in bytes. @default 5242880 */
  chunkSize?: MaybeRefOrGetter<number | undefined>

  /** How name collisions are settled. @default 'ask' */
  conflictStrategy?: MaybeRefOrGetter<FileConflictStrategy | 'ask' | undefined>

  /** Steps kept for undo. @default 50 */
  undoLimit?: number

  /** Called with feedback about operations. */
  onNotice?: (notice: FileManagerNotice) => void

  /** Replaces the default save of downloaded files. */
  saveFile?: (file: FileDownloadResult) => void

  /** Called when a file is opened. Return `false` to skip the built-in preview. */
  onOpenFile?: (entry: FileEntry) => boolean | void
}

interface UndoStep {
  label: string
  undo: () => Promise<void>
  redo: () => Promise<void>
}

interface CachedPage {
  page: FileListSnapshot
  time: number
}

interface FileListSnapshot extends FilePageResult {
  folder: FileEntry | null
  ancestors: FileEntry[]
}

const DEFAULT_SORT: FileSort = { field: 'name', direction: 'asc' }
const MAX_THUMBNAILS = 500

const getLocationKey = (location: FileManagerLocation) =>
  location.type === 'folder' ? `folder:${location.id}` : location.type

const isSameLocation = (first: FileManagerLocation, second: FileManagerLocation) =>
  getLocationKey(first) === getLocationKey(second)

/** Hands a file to the browser through a temporary link. */
export function saveFileToDevice({ fileName, url, blob }: FileDownloadResult) {
  const href = blob ? URL.createObjectURL(blob) : url

  if (!href || !isSafePreviewUrl(href)) {
    return
  }

  const link = document.createElement('a')

  link.href = href
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()

  if (blob) {
    setTimeout(() => URL.revokeObjectURL(href), 30000)
  }
}

/**
 * Headless state and operations of the file manager.
 *
 * `FileManager` creates one automatically. Create it yourself to drive the manager from your own
 * interface or to read its state from outside, then pass it through the `controller` prop.
 */
export function useFileManager(options: UseFileManagerOptions) {
  const adapter = computed(() => toValue(options.adapter))
  const capabilities = computed(() => resolveCapabilities(adapter.value))
  const labels = computed<FileManagerLabels>(() => mergeFileManagerLabels(toValue(options.labels)))

  const foldersFirst = computed(() => toValue(options.foldersFirst) ?? true)
  const pagination = computed(() => toValue(options.pagination) ?? 'none')
  const pageSize = computed(() => toValue(options.pageSize) ?? 100)
  const recursiveSearch = computed(() => toValue(options.recursiveSearch) ?? true)
  const conflictStrategy = computed(() => toValue(options.conflictStrategy) ?? 'ask')
  const cacheOptions = computed(() => toValue(options.cache))

  /** Handlers plugged in by the interface. Headless use keeps safe defaults. */
  const handlers = {
    confirm: async (_request: FileConfirmRequest) => true,
    resolveConflict: async (_request: FileConflictRequest): Promise<FileConflictDecision> => ({
      strategy: 'rename',
    }),
    notify: (_notice: FileManagerNotice) => {},
  }

  const notify = (notice: FileManagerNotice) => {
    options.onNotice?.(notice)
    handlers.notify(notice)
  }

  /* Navigation and listing */

  const location = shallowRef<FileManagerLocation>(
    options.initialLocation ?? { type: 'folder', id: options.initialFolderId ?? null },
  )
  const backStack = shallowRef<FileManagerLocation[]>([])
  const forwardStack = shallowRef<FileManagerLocation[]>([])
  const folder = shallowRef<FileEntry | null>(null)
  const ancestors = shallowRef<FileEntry[]>([])
  const items = shallowRef<FileEntry[]>([])
  const nextCursor = ref<string | null>(null)
  const total = ref<number | undefined>(undefined)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = shallowRef<FileErrorInfo | null>(null)

  const cache = new Map<string, CachedPage>()
  let loadController: AbortController | null = null
  let rootId: string | null = null

  /* Presentation state, kept here so that it survives a change of layout. */

  const view = ref<FileManagerViewName>(options.initialView ?? 'details')
  const sort = shallowRef<FileSort>(options.initialSort ?? DEFAULT_SORT)
  const filters = shallowRef<FileFilters>(options.initialFilters ?? {})
  const page = ref(1)

  /* Search */

  const searchQuery = ref('')
  const searchResults = shallowRef<FileEntry[] | null>(null)
  const searching = ref(false)
  let searchController: AbortController | null = null

  /* Selection */

  const selection = shallowRef<ReadonlySet<string>>(new Set(options.initialSelection))
  const anchorId = ref<string | null>(null)
  const activeId = ref<string | null>(null)

  /* Trees. The folder tree needs only folders, the tree view also lists files. */

  const folderTree = shallowRef<ReadonlyMap<string, FileEntry[]>>(new Map())
  const treeChildren = shallowRef<ReadonlyMap<string, FileEntry[]>>(new Map())
  const treeExpanded = shallowRef<ReadonlySet<string>>(new Set())
  const treeLoading = shallowRef<ReadonlySet<string>>(new Set())

  /* Clipboard, history of operations and preview */

  const clipboard = shallowRef<{ mode: 'cut' | 'copy'; entries: FileEntry[] } | null>(null)
  const undoStack = shallowRef<UndoStep[]>([])
  const redoStack = shallowRef<UndoStep[]>([])
  const previewEntry = shallowRef<FileEntry | null>(null)
  const pendingOperations = ref(0)

  const thumbnails = new Map<string, Promise<string | null>>()
  const objectUrls = new Map<string, string>()
  const operationController = new AbortController()

  const isSearching = computed(() => searchQuery.value.trim() !== '')
  const inTrash = computed(() => location.value.type === 'trash')
  const inFolder = computed(() => location.value.type === 'folder')

  /** Id of the folder new items go to, `undefined` in a virtual location. */
  const currentFolderId = computed(() =>
    location.value.type === 'folder' ? (folder.value?.id ?? location.value.id) : undefined,
  )

  const canGoBack = computed(() => backStack.value.length > 0)
  const canGoForward = computed(() => forwardStack.value.length > 0)
  const canGoUp = computed(
    () => location.value.type !== 'folder' || (folder.value?.parentId ?? null) !== null,
  )
  const canWriteHere = computed(() => inFolder.value && hasPermission(folder.value, 'write'))

  const sortForEntries = (entries: FileEntry[]) =>
    sortEntries(entries, sort.value, foldersFirst.value)

  const baseEntries = computed(() => {
    const entryFilter = unref(options.entryFilter)
    const usesLocalQuery = isSearching.value && searchResults.value === null
    const source = searchResults.value ?? items.value

    return sortForEntries(
      source.filter(
        (entry) =>
          matchesFilters(entry, filters.value) &&
          (!usesLocalQuery || matchesQuery(entry, searchQuery.value)) &&
          (!entryFilter || entryFilter(entry)),
      ),
    )
  })

  /** Depth of each row in the tree layout. Other layouts are flat. */
  const entryDepths = computed(() => {
    const depths = new Map<string, number>()

    if (view.value !== 'tree' || isSearching.value) {
      return depths
    }

    const walk = (entries: FileEntry[], depth: number) => {
      entries.forEach((entry) => {
        depths.set(entry.id, depth)

        if (entry.kind === 'folder' && treeExpanded.value.has(entry.id)) {
          walk(treeChildren.value.get(entry.id) ?? [], depth + 1)
        }
      })
    }

    walk(baseEntries.value, 0)

    return depths
  })

  /** Every entry the current layout shows, in order. */
  const visibleEntries = computed(() => {
    if (view.value !== 'tree' || isSearching.value) {
      return baseEntries.value
    }

    const rows: FileEntry[] = []

    const walk = (entries: FileEntry[]) => {
      entries.forEach((entry) => {
        rows.push(entry)

        if (entry.kind === 'folder' && treeExpanded.value.has(entry.id)) {
          walk(sortForEntries(treeChildren.value.get(entry.id) ?? []))
        }
      })
    }

    walk(baseEntries.value)

    return rows
  })

  const pageCount = computed(() => {
    if (pagination.value !== 'pages') {
      return 1
    }

    const known = hasActiveCriteria() ? visibleEntries.value.length : (total.value ?? 0)

    return Math.max(1, Math.ceil(Math.max(known, visibleEntries.value.length) / pageSize.value))
  })

  /** The visible entries of the current page. */
  const pageEntries = computed(() => {
    if (pagination.value !== 'pages') {
      return visibleEntries.value
    }

    const start = (page.value - 1) * pageSize.value

    return visibleEntries.value.slice(start, start + pageSize.value)
  })

  const entryIndex = computed(() => new Map(visibleEntries.value.map((entry) => [entry.id, entry])))

  /**
   * The selected entries the user can currently see. A filter can hide part of a selection, and
   * operations must not touch what is not on screen. Clearing the filter brings it back.
   */
  const selectedEntries = computed(() =>
    [...selection.value].flatMap((id) => {
      const entry = entryIndex.value.get(id)
      return entry ? [entry] : []
    }),
  )

  const hasMore = computed(() => !!nextCursor.value && !isSearching.value)

  function hasActiveCriteria() {
    return isSearching.value || Object.keys(filters.value).length > 0
  }

  /* Listing */

  async function fetchPage(
    target: FileManagerLocation,
    cursor: string | undefined,
    signal: AbortSignal,
  ): Promise<FileListSnapshot> {
    const paged = pagination.value !== 'none'
    const request = {
      cursor,
      limit: paged ? pageSize.value : undefined,
      sort: capabilities.value.serverSort ? sort.value : undefined,
      signal,
    }
    const source = adapter.value

    if (target.type === 'folder') {
      return source.list({ ...request, folderId: target.id })
    }

    const listers = {
      favorites: source.listStarred,
      recent: source.listRecent,
      trash: source.listTrash,
    }
    const lister = listers[target.type]

    if (!lister) {
      throw new FileManagerError('unsupported', labels.value.errors.unsupported)
    }

    return { ...(await lister.call(source, request)), folder: null, ancestors: [] }
  }

  /**
   * The root is requested as `null` but has an id of its own, which entries refer to as their
   * `parentId`. Both have to be recognized as the same folder.
   */
  const isSameFolder = (first: string | null, second: string | null) =>
    (first ?? rootId) === (second ?? rootId)

  function applySnapshot(snapshot: FileListSnapshot) {
    rootId =
      snapshot.ancestors[0]?.id ??
      (snapshot.folder?.parentId === null ? snapshot.folder.id : rootId)
    folder.value = snapshot.folder
    ancestors.value = snapshot.ancestors
    items.value = snapshot.items
    nextCursor.value = snapshot.nextCursor ?? null
    total.value = snapshot.total
  }

  function writeCache(key: string, snapshot: FileListSnapshot) {
    const config = cacheOptions.value

    if (config === false) {
      return
    }

    cache.delete(key)
    cache.set(key, { page: snapshot, time: Date.now() })

    if (cache.size > (config?.maxEntries ?? 50)) {
      cache.delete(cache.keys().next().value as string)
    }
  }

  function readCache(key: string) {
    const config = cacheOptions.value
    const cached = cache.get(key)

    if (config === false || !cached || Date.now() - cached.time > (config?.ttl ?? 30000)) {
      return null
    }

    return cached.page
  }

  /** Loads the current location. A newer call cancels the previous one. */
  async function load(mode: { force?: boolean; silent?: boolean } = {}) {
    loadController?.abort()

    const controller = new AbortController()
    const target = location.value
    const key = `${getLocationKey(target)}|${capabilities.value.serverSort ? `${sort.value.field}:${sort.value.direction}` : ''}`

    loadController = controller

    const cached = mode.force ? null : readCache(key)

    if (cached) {
      applySnapshot(cached)
      error.value = null
      loading.value = false
      return
    }

    if (!mode.silent) {
      loading.value = true
      items.value = []
      nextCursor.value = null
      total.value = undefined
    }

    error.value = null

    try {
      let snapshot = await fetchPage(target, undefined, controller.signal)

      // Without pagination the whole folder is expected, even if the backend pages it.
      while (pagination.value === 'none' && snapshot.nextCursor) {
        const next = await fetchPage(target, snapshot.nextCursor, controller.signal)

        snapshot = { ...next, items: [...snapshot.items, ...next.items] }
      }

      if (controller === loadController) {
        applySnapshot(snapshot)
        writeCache(key, snapshot)
      }
    } catch (cause) {
      if (controller === loadController && !isAbortError(cause)) {
        error.value = toFileErrorInfo(cause)

        if (!mode.silent) {
          items.value = []
        }
      }
    } finally {
      if (controller === loadController) {
        loading.value = false
      }
    }
  }

  /** Appends the next page of the current location. */
  async function loadMore() {
    const cursor = nextCursor.value

    if (!cursor || loadingMore.value) {
      return
    }

    const controller = loadController ?? new AbortController()
    const target = location.value

    loadingMore.value = true

    try {
      const snapshot = await fetchPage(target, cursor, controller.signal)

      if (isSameLocation(target, location.value) && !controller.signal.aborted) {
        const known = new Set(items.value.map((entry) => entry.id))

        items.value = [...items.value, ...snapshot.items.filter((entry) => !known.has(entry.id))]
        nextCursor.value = snapshot.nextCursor ?? null
        total.value = snapshot.total ?? total.value
      }
    } catch (cause) {
      if (!isAbortError(cause)) {
        notifyFailure(labels.value.loadMore, cause)
      }
    } finally {
      loadingMore.value = false
    }
  }

  function enterLocation(target: FileManagerLocation) {
    location.value = target
    previewEntry.value = null
    page.value = 1
    activeId.value = null
    anchorId.value = null
    selection.value = new Set()
    clearSearchState()
    void load()
  }

  function navigate(target: FileManagerLocation) {
    if (isSameLocation(target, location.value)) {
      return load({ force: true })
    }

    backStack.value = [...backStack.value, location.value]
    forwardStack.value = []
    enterLocation(target)

    return Promise.resolve()
  }

  const openFolder = (id: string | null) => navigate({ type: 'folder', id })

  function goBack() {
    const target = backStack.value.at(-1)

    if (target) {
      backStack.value = backStack.value.slice(0, -1)
      forwardStack.value = [...forwardStack.value, location.value]
      enterLocation(target)
    }
  }

  function goForward() {
    const target = forwardStack.value.at(-1)

    if (target) {
      forwardStack.value = forwardStack.value.slice(0, -1)
      backStack.value = [...backStack.value, location.value]
      enterLocation(target)
    }
  }

  function goUp() {
    if (location.value.type === 'folder') {
      const parentId = folder.value?.parentId

      if (parentId !== null && parentId !== undefined) {
        void openFolder(parentId)
      }
    } else {
      void openFolder(null)
    }
  }

  function clearCache() {
    cache.clear()
  }

  async function refresh() {
    clearCache()

    await Promise.all([
      load({ force: true }),
      ...[...folderTree.value.keys()].map((id) =>
        loadFolderChildren(toFolderId(id)).catch(() => undefined),
      ),
      ...[...treeChildren.value.keys()].map(loadTreeChildren),
    ])

    if (isSearching.value) {
      await runSearch()
    }
  }

  /** Opens a folder, or previews or downloads a file. */
  function open(entry: FileEntry) {
    if (inTrash.value) {
      return
    }

    if (entry.kind === 'folder') {
      void openFolder(entry.id)
    } else if (options.onOpenFile?.(entry) !== false) {
      if (capabilities.value.preview && hasPermission(entry, 'read')) {
        previewEntry.value = entry
      } else if (capabilities.value.download && hasPermission(entry, 'download')) {
        void download([entry])
      }
    }
  }

  /* Folder tree */

  const ROOT_KEY = '__root__'
  const toTreeKey = (id: string | null) => (id === null || id === rootId ? ROOT_KEY : id)
  const toFolderId = (key: string) => (key === ROOT_KEY ? null : key)

  async function loadAllPages(folderId: string | null, foldersOnly: boolean) {
    const entries: FileEntry[] = []
    let cursor: string | undefined

    do {
      const result = await adapter.value.list({
        folderId,
        foldersOnly,
        cursor,
        signal: operationController.signal,
      })

      entries.push(...result.items)
      cursor = result.nextCursor ?? undefined
    } while (cursor)

    return entries
  }

  /** Loads the subfolders shown under a node of the folder tree. */
  async function loadFolderChildren(folderId: string | null) {
    const entries = await loadAllPages(folderId, true)
    const next = new Map(folderTree.value)

    next.set(
      toTreeKey(folderId),
      sortEntries(
        entries.filter((entry) => entry.kind === 'folder'),
        DEFAULT_SORT,
      ),
    )
    folderTree.value = next
  }

  const getFolderChildren = (folderId: string | null) => folderTree.value.get(toTreeKey(folderId))

  async function loadTreeChildren(folderId: string) {
    treeLoading.value = new Set([...treeLoading.value, folderId])

    try {
      const entries = await loadAllPages(folderId, false)

      treeChildren.value = new Map(treeChildren.value).set(folderId, entries)
    } catch (cause) {
      if (!isAbortError(cause)) {
        notifyFailure(labels.value.open, cause)
      }
    } finally {
      const next = new Set(treeLoading.value)

      next.delete(folderId)
      treeLoading.value = next
    }
  }

  /** Expands or collapses a row of the tree layout. */
  function toggleExpanded(entry: FileEntry) {
    const next = new Set(treeExpanded.value)

    if (next.delete(entry.id)) {
      treeExpanded.value = next
      return
    }

    next.add(entry.id)
    treeExpanded.value = next

    if (!treeChildren.value.has(entry.id)) {
      void loadTreeChildren(entry.id)
    }
  }

  /* Search */

  function clearSearchState() {
    searchController?.abort()
    searchController = null
    searchQuery.value = ''
    searchResults.value = null
    searching.value = false
  }

  /** Runs the current query. Backends without search filter the loaded entries instead. */
  async function runSearch() {
    searchController?.abort()

    const query = searchQuery.value.trim()
    const search = adapter.value.search

    if (!query || !capabilities.value.search || !search || !inFolder.value) {
      searchResults.value = null
      searching.value = false
      return
    }

    const controller = new AbortController()

    searchController = controller
    searching.value = true

    try {
      const result = await search.call(adapter.value, {
        query,
        folderId: currentFolderId.value ?? null,
        recursive: recursiveSearch.value,
        filters: filters.value,
        signal: controller.signal,
      })

      if (controller === searchController) {
        searchResults.value = result.items
      }
    } catch (cause) {
      if (controller === searchController && !isAbortError(cause)) {
        searchResults.value = null
        notifyFailure(labels.value.search, cause)
      }
    } finally {
      if (controller === searchController) {
        searching.value = false
      }
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
    page.value = 1

    return runSearch()
  }

  function setSort(next: FileSort) {
    sort.value = next

    // A partially loaded folder can only be sorted correctly by the backend.
    if (capabilities.value.serverSort && nextCursor.value) {
      void load()
    }
  }

  /** Sorts by a field, flipping the direction when it is already the active one. */
  function toggleSort(field: FileSortField) {
    setSort({
      field,
      direction: sort.value.field === field && sort.value.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  function setFilters(next: FileFilters) {
    filters.value = Object.fromEntries(
      Object.entries(next).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : value !== undefined && value !== false,
      ),
    )
    page.value = 1
  }

  const clearFilters = () => setFilters({})

  function setPage(next: number) {
    page.value = next

    // Later pages may not be loaded yet. Walk the cursor until they are.
    const needed = next * pageSize.value

    const fill = async () => {
      while (items.value.length < needed && nextCursor.value) {
        await loadMore()
      }
    }

    return fill()
  }

  /* Selection */

  function setSelection(ids: Iterable<string>) {
    selection.value = new Set(ids)
  }

  /** Applies a click-like selection gesture to an entry. */
  function select(id: string, mode: FileSelectionMode = 'replace') {
    const ids = visibleEntries.value.map((entry) => entry.id)

    if (mode === 'range' && anchorId.value !== null) {
      const from = ids.indexOf(anchorId.value)
      const to = ids.indexOf(id)

      if (from !== -1 && to !== -1) {
        setSelection(ids.slice(Math.min(from, to), Math.max(from, to) + 1))
        activeId.value = id
        return
      }
    }

    if (mode === 'toggle' || mode === 'add') {
      const next = new Set(selection.value)

      if (mode === 'toggle' && next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      selection.value = next
    } else {
      selection.value = new Set([id])
    }

    anchorId.value = id
    activeId.value = id
  }

  const selectAll = () => setSelection(visibleEntries.value.map((entry) => entry.id))

  function clearSelection() {
    selection.value = new Set()
    anchorId.value = null
  }

  const isSelected = (id: string) => selection.value.has(id)

  /* Feedback */

  function notifyFailure(operation: string, cause: unknown) {
    const info = toFileErrorInfo(cause)

    notify({
      status: 'error',
      title: labels.value.operationFailed(operation),
      message: labels.value.errors[info.code] === info.message ? undefined : describeError(info),
    })
  }

  /** Prefers the backend's own wording, it usually names the file and the reason. */
  function describeError(info: FileErrorInfo) {
    return info.message || labels.value.errors[info.code]
  }

  function reportBulk(operation: FileOperation, title: string, result: FileBulkResult) {
    const { succeeded, failed } = result
    const count = succeeded.length + failed.length

    if (failed.length > 0) {
      const shown = failed.slice(0, 3).map((failure) => {
        const reason = describeError(failure.error)
        return failure.name ? `${failure.name}: ${reason}` : reason
      })
      const rest = failed.length - shown.length

      notify({
        status: succeeded.length > 0 ? 'warning' : 'error',
        title: labels.value.operationPartiallyFailed(title, failed.length, count),
        message: [...shown, ...(rest > 0 ? [labels.value.moreFailures(rest)] : [])].join('\n'),
        operation,
      })
    } else if (succeeded.length > 0) {
      notify({
        status: 'success',
        title: labels.value.operationCompleted(title, succeeded.length),
        operation,
      })
    }
  }

  /* Mutations */

  /**
   * Operations run strictly one after the other. Two overlapping moves could otherwise act on an
   * entry the first one already relocated.
   */
  let queue: Promise<unknown> = Promise.resolve()

  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    pendingOperations.value += 1

    const run = queue.then(task, task).finally(() => {
      pendingOperations.value -= 1
    })

    queue = run.catch(() => undefined)

    return run
  }

  /** Brings every affected view up to date after a mutation. */
  async function afterMutation(folderIds: (string | null | undefined)[] = []) {
    clearCache()

    const affected = new Set(folderIds.filter((id): id is string | null => id !== undefined))

    await Promise.all([
      load({ force: true, silent: true }),
      ...[...affected]
        // The current folder is always included: it may have just gained its first subfolder.
        .filter((id) => folderTree.value.has(toTreeKey(id)) || id === currentFolderId.value)
        .map((id) => loadFolderChildren(id)),
      ...[...affected]
        .filter((id): id is string => id !== null && treeChildren.value.has(id))
        .map(loadTreeChildren),
    ]).catch(() => undefined)

    if (isSearching.value) {
      await runSearch()
    }
  }

  const pushUndo = (step: UndoStep) => {
    undoStack.value = [...undoStack.value, step].slice(-(options.undoLimit ?? 50))
    redoStack.value = []
  }

  const removeFromSelection = (ids: string[]) => {
    const next = new Set(selection.value)

    ids.forEach((id) => next.delete(id))
    selection.value = next
  }

  const getNewIds = (result: FileBulkResult) =>
    result.succeeded.map((item) => item.entry?.id ?? item.sourceId)

  const uniqueParents = (entries: FileEntry[]) => [...new Set(entries.map((e) => e.parentId))]

  async function getFolderName(id: string | null | undefined) {
    if (id === undefined || id === folder.value?.id) {
      return folder.value?.name ?? labels.value.home
    }

    if (id === null) {
      return labels.value.home
    }

    const known = [...folderTree.value.values()].flat().find((entry) => entry.id === id)

    return (
      known?.name ??
      (await adapter.value.get?.({ id }).catch(() => undefined))?.name ??
      labels.value.folders
    )
  }

  /**
   * Runs a transfer and settles its name conflicts.
   *
   * The first attempt reports conflicts per item, then each conflicting item is asked about and
   * retried with the chosen strategy, so items without a conflict are not held back.
   */
  async function transferWithConflicts(
    operation: 'move' | 'copy',
    entries: FileEntry[],
    targetId: string | null,
    strategy: FileConflictStrategy | 'ask',
  ) {
    const run = adapter.value[operation]

    if (!run) {
      throw new FileManagerError('unsupported', labels.value.errors.unsupported)
    }

    const send = (ids: string[], conflict: FileConflictStrategy) =>
      run.call(adapter.value, {
        ids,
        targetId,
        conflict,
        signal: operationController.signal,
      })

    const first = await send(
      entries.map((entry) => entry.id),
      strategy === 'ask' ? 'fail' : strategy,
    )

    const result: FileBulkResult = {
      succeeded: [...first.succeeded],
      failed: [],
      skipped: [...(first.skipped ?? [])],
    }
    const conflicts = first.failed.filter(
      (failure) => strategy === 'ask' && failure.error.code === 'conflict',
    )

    result.failed.push(...first.failed.filter((failure) => !conflicts.includes(failure)))

    const names = new Map(entries.map((entry) => [entry.id, entry.name]))
    let applied: FileConflictDecision['strategy'] = null
    let overwritten = false

    for (const [index, conflict] of conflicts.entries()) {
      const decision: FileConflictDecision = applied
        ? { strategy: applied }
        : await handlers.resolveConflict({
            name: conflict.name ?? names.get(conflict.id) ?? conflict.id,
            existing: conflict.error.conflictWith,
            destination: await getFolderName(targetId),
            remaining: conflicts.length - index - 1,
            operation,
          })

      if (decision.strategy === null) {
        result.skipped?.push(...conflicts.slice(index).map((item) => item.id))
        break
      }

      if (decision.applyToAll) {
        applied = decision.strategy
      }

      if (decision.strategy === 'skip') {
        result.skipped?.push(conflict.id)
      } else {
        const retried = await send([conflict.id], decision.strategy)

        overwritten ||= decision.strategy === 'overwrite' && retried.succeeded.length > 0
        result.succeeded.push(...retried.succeeded)
        result.failed.push(...retried.failed)
        result.skipped?.push(...(retried.skipped ?? []))
      }
    }

    return { result, overwritten }
  }

  /** Runs one operation, turning an unexpected rejection into feedback. */
  async function guarded<T>(title: string, task: () => Promise<T>): Promise<T | undefined> {
    try {
      return await task()
    } catch (cause) {
      if (!isAbortError(cause)) {
        notifyFailure(title, cause)
      }

      return undefined
    }
  }

  function createFolder(name: string, parentId = currentFolderId.value) {
    const create = adapter.value.createFolder

    if (!create || parentId === undefined) {
      return Promise.resolve(undefined)
    }

    const title = labels.value.newFolder

    return enqueue(() =>
      guarded(title, async () => {
        let entry = await create.call(adapter.value, {
          parentId,
          name,
          signal: operationController.signal,
        })

        if (adapter.value.delete) {
          pushUndo({
            label: title,
            undo: async () => {
              await requireBulk(await adapter.value.delete?.({ ids: [entry.id] }))
              await afterMutation([parentId])
            },
            redo: async () => {
              entry = await create.call(adapter.value, { parentId, name })
              await afterMutation([parentId])
            },
          })
        }

        await afterMutation([parentId])
        selection.value = new Set([entry.id])
        activeId.value = entry.id
        anchorId.value = entry.id
        notify({
          status: 'success',
          title: labels.value.operationCompleted(title, 1),
          operation: 'createFolder',
        })

        return entry
      }),
    )
  }

  /** Throws when an undo step could not be applied in full. */
  async function requireBulk(result: FileBulkResult | undefined) {
    if (result?.failed.length) {
      const [failure] = result.failed
      throw new FileManagerError(failure.error.code, failure.error.message)
    }

    return result
  }

  function rename(entry: FileEntry, name: string) {
    const run = adapter.value.rename

    if (!run || name === entry.name) {
      return Promise.resolve(entry)
    }

    const title = labels.value.rename

    return enqueue(() =>
      guarded(title, async () => {
        let current = await run.call(adapter.value, {
          id: entry.id,
          name,
          signal: operationController.signal,
        })

        pushUndo({
          label: title,
          undo: async () => {
            current = await run.call(adapter.value, { id: current.id, name: entry.name })
            await afterMutation([entry.parentId])
          },
          redo: async () => {
            current = await run.call(adapter.value, { id: current.id, name })
            await afterMutation([entry.parentId])
          },
        })

        if (entry.id !== current.id) {
          removeFromSelection([entry.id])
        }

        await afterMutation([entry.parentId])
        notify({
          status: 'success',
          title: labels.value.operationCompleted(title, 1),
          operation: 'rename',
        })

        return current
      }),
    )
  }

  function move(entries: FileEntry[], targetId: string | null) {
    const title = labels.value.moveTo.replace('…', '')
    const movable = entries.filter(
      (entry) => !isSameFolder(entry.parentId, targetId) && entry.id !== targetId,
    )

    if (movable.length === 0) {
      return Promise.resolve(undefined)
    }

    return enqueue(() =>
      guarded(title, async () => {
        const { result, overwritten } = await transferWithConflicts(
          'move',
          movable,
          targetId,
          conflictStrategy.value,
        )
        const parents = uniqueParents(movable)

        if (result.succeeded.length > 0 && !overwritten) {
          let moved = result.succeeded.map((item) => ({
            id: item.entry?.id ?? item.sourceId,
            parentId: movable.find((entry) => entry.id === item.sourceId)?.parentId ?? null,
          }))

          pushUndo({
            label: title,
            undo: async () => {
              const next: typeof moved = []

              for (const parentId of new Set(moved.map((item) => item.parentId))) {
                const group = moved.filter((item) => item.parentId === parentId)
                const undone = await requireBulk(
                  await adapter.value.move?.({
                    ids: group.map((item) => item.id),
                    targetId: parentId,
                    conflict: 'rename',
                  }),
                )

                next.push(
                  ...group.map((item) => ({
                    id:
                      undone?.succeeded.find((success) => success.sourceId === item.id)?.entry
                        ?.id ?? item.id,
                    parentId,
                  })),
                )
              }

              moved = next
              await afterMutation([...parents, targetId])
            },
            redo: async () => {
              const redone = await requireBulk(
                await adapter.value.move?.({
                  ids: moved.map((item) => item.id),
                  targetId,
                  conflict: 'rename',
                }),
              )

              moved = moved.map((item) => ({
                ...item,
                id:
                  redone?.succeeded.find((success) => success.sourceId === item.id)?.entry?.id ??
                  item.id,
              }))
              await afterMutation([...parents, targetId])
            },
          })
        }

        removeFromSelection(result.succeeded.map((item) => item.sourceId))
        await afterMutation([...parents, targetId])
        reportBulk('move', title, result)

        return result
      }),
    )
  }

  function copy(entries: FileEntry[], targetId: string | null, operation: FileOperation = 'copy') {
    const title =
      operation === 'duplicate' ? labels.value.duplicate : labels.value.copyTo.replace('…', '')

    if (entries.length === 0) {
      return Promise.resolve(undefined)
    }

    return enqueue(() =>
      guarded(title, async () => {
        const { result, overwritten } = await transferWithConflicts(
          'copy',
          entries,
          targetId,
          operation === 'duplicate' ? 'rename' : conflictStrategy.value,
        )

        if (result.succeeded.length > 0 && !overwritten && adapter.value.delete) {
          let copies = getNewIds(result)
          const sources = result.succeeded.map((item) => item.sourceId)

          pushUndo({
            label: title,
            undo: async () => {
              await requireBulk(await adapter.value.delete?.({ ids: copies }))
              await afterMutation([targetId])
            },
            redo: async () => {
              const redone = await adapter.value.copy?.({
                ids: sources,
                targetId,
                conflict: 'rename',
              })

              if (redone) {
                copies = getNewIds((await requireBulk(redone)) as FileBulkResult)
              }

              await afterMutation([targetId])
            },
          })
        }

        await afterMutation([targetId])

        if (operation === 'duplicate') {
          setSelection(getNewIds(result))
        }

        reportBulk(operation, title, result)

        return result
      }),
    )
  }

  /** Copies entries next to themselves under a free name. */
  async function duplicate(entries: FileEntry[]) {
    for (const parentId of uniqueParents(entries)) {
      await copy(
        entries.filter((entry) => entry.parentId === parentId),
        parentId,
        'duplicate',
      )
    }
  }

  /** Moves entries to the trash, or removes them when the backend has no trash. */
  async function remove(entries: FileEntry[], confirmation: boolean = true) {
    if (entries.length === 0) {
      return undefined
    }

    if (!capabilities.value.trash || inTrash.value) {
      return deletePermanently(entries, confirmation)
    }

    const names = describeEntries(entries)

    if (
      confirmation &&
      confirmOperation('trash') &&
      !(await handlers.confirm({
        kind: 'trash',
        title: labels.value.trashTitle(entries.length),
        message: labels.value.trashMessage(names, entries.length),
        confirmLabel: labels.value.moveToTrash,
        entries,
      }))
    ) {
      return undefined
    }

    const title = labels.value.moveToTrash

    return enqueue(() =>
      guarded(title, async () => {
        const result = await adapter.value.trash!({
          ids: entries.map((entry) => entry.id),
          signal: operationController.signal,
        })
        const parents = uniqueParents(entries)

        if (result.succeeded.length > 0 && capabilities.value.restore) {
          let trashed = getNewIds(result)

          pushUndo({
            label: title,
            undo: async () => {
              const restored = await requireBulk(await adapter.value.restore?.({ ids: trashed }))

              trashed = restored ? getNewIds(restored) : trashed
              await afterMutation(parents)
            },
            redo: async () => {
              const again = await requireBulk(await adapter.value.trash?.({ ids: trashed }))

              trashed = again ? getNewIds(again) : trashed
              await afterMutation(parents)
            },
          })
        }

        removeFromSelection(result.succeeded.map((item) => item.sourceId))
        await afterMutation(parents)
        reportBulk('trash', title, result)

        return result
      }),
    )
  }

  async function deletePermanently(entries: FileEntry[], confirmation: boolean = true) {
    const run = adapter.value.delete

    if (!run || entries.length === 0) {
      return undefined
    }

    if (
      confirmation &&
      confirmOperation('delete') &&
      !(await handlers.confirm({
        kind: 'delete',
        title: labels.value.deleteTitle(entries.length),
        message: labels.value.deleteMessage(describeEntries(entries), entries.length),
        confirmLabel: labels.value.deletePermanently,
        entries,
      }))
    ) {
      return undefined
    }

    const title = labels.value.delete

    return enqueue(() =>
      guarded(title, async () => {
        const result = await run.call(adapter.value, {
          ids: entries.map((entry) => entry.id),
          signal: operationController.signal,
        })

        removeFromSelection(result.succeeded.map((item) => item.sourceId))
        // Earlier steps may refer to entries that are now gone for good.
        clearHistory()
        await afterMutation(uniqueParents(entries))
        reportBulk('delete', title, result)

        return result
      }),
    )
  }

  function clearHistory() {
    undoStack.value = []
    redoStack.value = []
  }

  function restore(entries: FileEntry[]) {
    const run = adapter.value.restore
    const title = labels.value.restore

    if (!run || entries.length === 0) {
      return Promise.resolve(undefined)
    }

    return enqueue(() =>
      guarded(title, async () => {
        const result = await run.call(adapter.value, {
          ids: entries.map((entry) => entry.id),
          signal: operationController.signal,
        })

        removeFromSelection(result.succeeded.map((item) => item.sourceId))
        await afterMutation(result.succeeded.map((item) => item.entry?.parentId))
        reportBulk('restore', title, result)

        return result
      }),
    )
  }

  async function emptyTrash() {
    const run = adapter.value.emptyTrash

    if (!run) {
      return
    }

    if (
      confirmOperation('emptyTrash') &&
      !(await handlers.confirm({
        kind: 'emptyTrash',
        title: labels.value.emptyTrashTitle,
        message: labels.value.emptyTrashMessage,
        confirmLabel: labels.value.emptyTrash,
        entries: [],
      }))
    ) {
      return
    }

    const title = labels.value.emptyTrash

    await enqueue(() =>
      guarded(title, async () => {
        await run.call(adapter.value, { signal: operationController.signal })
        clearHistory()
        clearSelection()
        await afterMutation()
        notify({ status: 'success', title, operation: 'emptyTrash' })
      }),
    )
  }

  function setStarred(entries: FileEntry[], starred: boolean) {
    const run = adapter.value.setStarred
    const title = starred ? labels.value.addToFavorites : labels.value.removeFromFavorites

    if (!run || entries.length === 0) {
      return Promise.resolve(undefined)
    }

    return enqueue(() =>
      guarded(title, async () => {
        const result = await run.call(adapter.value, {
          ids: entries.map((entry) => entry.id),
          starred,
          signal: operationController.signal,
        })

        await afterMutation()

        if (result.failed.length > 0) {
          reportBulk('star', title, result)
        }

        return result
      }),
    )
  }

  /* Clipboard */

  const canMutate = (entries: FileEntry[], permission: 'move' | 'copy') =>
    entries.length > 0 && entries.every((entry) => hasPermission(entry, permission))

  function cut(entries: FileEntry[]) {
    if (canMutate(entries, 'move') && capabilities.value.move) {
      clipboard.value = { mode: 'cut', entries }
      notify({ status: 'info', title: labels.value.clipboardCut(entries.length) })
    }
  }

  function copyToClipboard(entries: FileEntry[]) {
    if (canMutate(entries, 'copy') && capabilities.value.copy) {
      clipboard.value = { mode: 'copy', entries }
      notify({ status: 'info', title: labels.value.clipboardCopied(entries.length) })
    }
  }

  async function paste(targetId = currentFolderId.value) {
    const content = clipboard.value

    if (!content || targetId === undefined) {
      return
    }

    if (content.mode === 'cut') {
      const result = await move(content.entries, targetId)

      // A partial failure keeps what is left on the clipboard, so it can be pasted again.
      const moved = new Set(result?.succeeded.map((item) => item.sourceId) ?? [])
      const remaining = content.entries.filter((entry) => !moved.has(entry.id))

      clipboard.value = result && remaining.length > 0 ? { mode: 'cut', entries: remaining } : null
    } else {
      await copy(content.entries, targetId)
    }
  }

  const clearClipboard = () => {
    clipboard.value = null
  }

  const isCut = (id: string) =>
    clipboard.value?.mode === 'cut' && clipboard.value.entries.some((entry) => entry.id === id)

  /* Undo and redo */

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)
  const undoLabel = computed(() => undoStack.value.at(-1)?.label)
  const redoLabel = computed(() => redoStack.value.at(-1)?.label)

  function replay(
    from: typeof undoStack,
    to: typeof undoStack,
    run: (step: UndoStep) => Promise<void>,
    operation: 'undo' | 'redo',
  ) {
    return enqueue(async () => {
      const step = from.value.at(-1)

      if (!step) {
        return
      }

      from.value = from.value.slice(0, -1)

      const title =
        operation === 'undo'
          ? labels.value.undoOperation(step.label)
          : labels.value.redoOperation(step.label)

      try {
        await run(step)
        to.value = [...to.value, step]
        notify({ status: 'success', title, operation })
      } catch (cause) {
        // The step cannot be replayed anymore, for example the item changed since.
        notifyFailure(title, cause)
      }
    })
  }

  const undo = () => replay(undoStack, redoStack, (step) => step.undo(), 'undo')
  const redo = () => replay(redoStack, undoStack, (step) => step.redo(), 'redo')

  /* Download and thumbnails */

  const saveFile = (file: FileDownloadResult) => (options.saveFile ?? saveFileToDevice)(file)

  async function download(entries: FileEntry[]) {
    const source = adapter.value
    const title = labels.value.download
    const allowed = entries.filter((entry) => hasPermission(entry, 'download'))
    const hasFolder = allowed.some((entry) => entry.kind === 'folder')

    if (allowed.length === 0) {
      return
    }

    const single = allowed.length === 1 && !hasFolder

    if (!single && source.downloadMany && capabilities.value.downloadMany) {
      await guarded(title, async () => {
        saveFile(await source.downloadMany!({ ids: allowed.map((entry) => entry.id) }))
      })
      return
    }

    if (hasFolder) {
      notify({ status: 'warning', title, message: labels.value.downloadFolderUnsupported })
    }

    if (!source.download) {
      return
    }

    const failed: FileBulkResult['failed'] = []
    const succeeded: FileBulkResult['succeeded'] = []

    for (const entry of allowed.filter((item) => item.kind === 'file')) {
      try {
        saveFile(await source.download({ id: entry.id }))
        succeeded.push({ sourceId: entry.id })
      } catch (cause) {
        failed.push({ id: entry.id, name: entry.name, error: toFileErrorInfo(cause) })
      }
    }

    if (failed.length > 0) {
      reportBulk('download', title, { succeeded, failed })
    }
  }

  /** Resolves the thumbnail of an entry. Results are cached and object urls are tracked. */
  function getThumbnail(entry: FileEntry, size = 256) {
    if (entry.thumbnailUrl) {
      return Promise.resolve(isSafePreviewUrl(entry.thumbnailUrl) ? entry.thumbnailUrl : null)
    }

    const source = adapter.value

    if (!source.getThumbnail || !capabilities.value.thumbnails) {
      return Promise.resolve(null)
    }

    const key = `${entry.id}:${entry.modifiedAt ?? ''}:${size}`
    const cached = thumbnails.get(key)

    if (cached) {
      return cached
    }

    const request = source
      .getThumbnail({
        id: entry.id,
        width: size,
        height: size,
        signal: operationController.signal,
      })
      .then((result) => {
        if (result instanceof Blob) {
          const url = URL.createObjectURL(result)

          objectUrls.set(key, url)

          return url
        }

        return result && isSafePreviewUrl(result) ? result : null
      })
      .catch(() => {
        thumbnails.delete(key)
        return null
      })

    thumbnails.set(key, request)

    if (thumbnails.size > MAX_THUMBNAILS) {
      const oldest = thumbnails.keys().next().value as string
      const url = objectUrls.get(oldest)

      thumbnails.delete(oldest)

      if (url) {
        URL.revokeObjectURL(url)
        objectUrls.delete(oldest)
      }
    }

    return request
  }

  /* Preview */

  const previewableEntries = computed(() =>
    visibleEntries.value.filter((entry) => entry.kind === 'file'),
  )

  function stepPreview(direction: 1 | -1) {
    const entries = previewableEntries.value
    const index = entries.findIndex((entry) => entry.id === previewEntry.value?.id)

    if (index !== -1 && entries.length > 1) {
      previewEntry.value = entries[(index + direction + entries.length) % entries.length]
    }
  }

  const closePreview = () => {
    previewEntry.value = null
  }

  /* Uploads */

  let pendingRefresh: ReturnType<typeof setTimeout> | undefined
  const uploadedParents = new Set<string | null>()

  /** Files finishing together trigger a single reload. */
  function scheduleUploadRefresh(item: FileUploadItem) {
    uploadedParents.add(item.parentId)
    clearTimeout(pendingRefresh)
    pendingRefresh = setTimeout(() => {
      const parents = [...uploadedParents]

      uploadedParents.clear()
      void afterMutation(parents)
    }, 150)
  }

  const uploads = useUploadQueue({
    adapter,
    capabilities,
    labels,
    restrictions: () => toValue(options.restrictions),
    concurrency: () => toValue(options.uploadConcurrency) ?? 3,
    chunkSize: () => toValue(options.chunkSize) ?? DEFAULT_CHUNK_SIZE,
    conflictStrategy: () => conflictStrategy.value,
    resolveConflict: async ({ name, existing, parentId, remaining }) =>
      handlers.resolveConflict({
        name,
        existing,
        remaining,
        destination: await getFolderName(parentId),
        operation: 'upload',
      }),
    onUploaded: scheduleUploadRefresh,
  })

  /** Queues files for upload. Without `parentId` they go to the current folder. */
  function upload(
    files: (File | FileUploadInput)[],
    parentId: string | null | undefined = currentFolderId.value,
  ) {
    if (parentId === undefined || !capabilities.value.upload) {
      return []
    }

    return uploads.add(
      files.map((file) => (file instanceof File ? { file } : file)),
      parentId,
    )
  }

  /* Helpers */

  const confirmOptions = ref<FileManagerConfirmOptions | boolean>(true)

  function confirmOperation(kind: keyof FileManagerConfirmOptions) {
    const value = confirmOptions.value

    return typeof value === 'boolean' ? value : value[kind] !== false
  }

  function describeEntries(entries: FileEntry[]) {
    return entries.length === 1 ? entries[0].name : labels.value.itemsCount(entries.length)
  }

  /** Replaces the handlers behind prompts and feedback. Used by the built-in interface. */
  function setHandlers(next: Partial<typeof handlers>) {
    Object.assign(handlers, next)
  }

  function dispose() {
    loadController?.abort()
    searchController?.abort()
    operationController.abort()
    clearTimeout(pendingRefresh)
    uploads.dispose()
    objectUrls.forEach((url) => URL.revokeObjectURL(url))
    objectUrls.clear()
    thumbnails.clear()
  }

  // Replacing the adapter means another file system. Nothing loaded so far applies to it.
  watch(adapter, () => {
    clearCache()
    folderTree.value = new Map()
    treeChildren.value = new Map()
    treeExpanded.value = new Set()
    clearHistory()
    clipboard.value = null
    backStack.value = []
    forwardStack.value = []
    enterLocation({ type: 'folder', id: null })
  })

  if (getCurrentScope()) {
    onScopeDispose(dispose)
  }

  return {
    adapter,
    capabilities,
    labels,

    location,
    folder,
    ancestors,
    items,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    inTrash,
    inFolder,
    currentFolderId,
    canGoBack,
    canGoForward,
    canGoUp,
    canWriteHere,
    isSameFolder,
    navigate,
    openFolder,
    open,
    goBack,
    goForward,
    goUp,
    load,
    loadMore,
    refresh,
    clearCache,

    view,
    sort,
    filters,
    page,
    pageCount,
    pagination,
    pageSize,
    foldersFirst,
    visibleEntries,
    pageEntries,
    entryDepths,
    setSort,
    toggleSort,
    setFilters,
    clearFilters,
    setPage,

    searchQuery,
    searching,
    isSearching,
    setSearchQuery,

    selection,
    selectedEntries,
    activeId,
    select,
    selectAll,
    setSelection,
    clearSelection,
    isSelected,

    folderTree,
    loadFolderChildren,
    getFolderChildren,
    treeExpanded,
    treeLoading,
    toggleExpanded,

    createFolder,
    rename,
    move,
    copy,
    duplicate,
    remove,
    deletePermanently,
    restore,
    emptyTrash,
    setStarred,
    download,
    upload,
    uploads,
    getThumbnail,

    clipboard,
    cut,
    copyToClipboard,
    paste,
    clearClipboard,
    isCut,

    undo,
    redo,
    canUndo,
    canRedo,
    undoLabel,
    redoLabel,

    previewEntry,
    previewableEntries,
    stepPreview,
    closePreview,

    pendingOperations,
    confirmOptions,
    setHandlers,
    notify,
    dispose,
  }
}

export type FileManagerController = ReturnType<typeof useFileManager>
