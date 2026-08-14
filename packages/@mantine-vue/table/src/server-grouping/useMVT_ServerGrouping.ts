import { getCurrentScope, onScopeDispose, ref, watch } from 'vue'

import { createRow as createTanstackRow } from '@tanstack/vue-table'

import type {
  MVT_ColumnFiltersState,
  MVT_Row,
  MVT_RowData,
  MVT_SortingState,
  MVT_TableInstance,
  MVT_Updater,
} from '../types'
import {
  MVT_SERVER_GROUPING_ROOT_PATH_ID,
  type MVT_ServerGroupNode,
  type MVT_ServerGroupPathId,
  type MVT_ServerGroupPathItem,
  type MVT_ServerGroupRequest,
  type MVT_ServerGroupingExpandedState,
  type MVT_ServerGroupingOptions,
  type MVT_ServerGroupingPathState,
  type MVT_ServerGroupingSelectAllState,
  type MVT_ServerGroupingState,
  type MVT_ServerPageState,
  type MVT_ServerRecordRequest,
} from './serverGrouping.types'
import {
  createServerGroupPathId,
  getServerGroupPathDepth,
  isAbortError,
  isServerGroupPathOrDescendant,
  serializeServerGroupingCacheKey,
} from './serverGrouping.utils'
import { deselectServerGroupingRecords } from './serverGroupingSelection'

interface CacheEntry {
  pathId: MVT_ServerGroupPathId
  payload: Pick<MVT_ServerGroupingPathState, 'groups' | 'kind' | 'rowCount' | 'rows'>
  updatedAt: number
}

/**
 * Internal server-grouping engine. Owns per-path query state (pagination,
 * sorting, filters, loading, errors), lazy loading, request cancellation,
 * stale-response protection, the optional cache, and expansion state.
 *
 * Created by `useMVT_TableInstance` when `serverGrouping.provider` is set; the
 * public surface is exposed through the `table.*ServerGrouping*` instance
 * methods and the `<MantineVueTable>` built-in rendering.
 */
export interface MVT_ServerGroupingManager<TData extends MVT_RowData = MVT_RowData> {
  options: MVT_ServerGroupingOptions<TData, any, any, any>
  getGroupingFields: () => string[]
  getExpanded: () => MVT_ServerGroupingExpandedState
  setExpanded: (updater: MVT_Updater<MVT_ServerGroupingExpandedState>) => void
  /** "All matching records" (exclude-mode) selection state. */
  getSelectAll: () => MVT_ServerGroupingSelectAllState
  setSelectAll: (updater: MVT_Updater<MVT_ServerGroupingSelectAllState>) => void
  isExpanded: (pathId: MVT_ServerGroupPathId) => boolean
  getState: () => MVT_ServerGroupingState<TData>
  getPathState: (pathId: MVT_ServerGroupPathId) => MVT_ServerGroupingPathState<TData> | undefined
  /** Table rows of one loaded record page (created once, cached per page). */
  getRecordRows: (pathId: MVT_ServerGroupPathId) => MVT_Row<TData>[]
  /** All loaded record rows inside currently expanded groups. */
  getVisibleRecordRows: () => MVT_Row<TData>[]
  getNode: (pathId: MVT_ServerGroupPathId) => MVT_ServerGroupNode | undefined
  getParentItems: (pathId: MVT_ServerGroupPathId) => MVT_ServerGroupPathItem[]
  expand: (pathId: MVT_ServerGroupPathId) => void
  collapse: (pathId: MVT_ServerGroupPathId) => void
  toggle: (pathId: MVT_ServerGroupPathId) => void
  ensureLoaded: (pathId: MVT_ServerGroupPathId) => void
  reload: (pathId?: MVT_ServerGroupPathId) => void
  invalidate: (pathId?: MVT_ServerGroupPathId) => void
  retry: (pathId: MVT_ServerGroupPathId) => void
  reset: () => void
  setPagination: (
    pathId: MVT_ServerGroupPathId,
    updater: ((prev: MVT_ServerPageState) => MVT_ServerPageState) | Partial<MVT_ServerPageState>,
  ) => void
  setSorting: (pathId: MVT_ServerGroupPathId, updater: MVT_Updater<MVT_SortingState>) => void
  setColumnFilters: (
    pathId: MVT_ServerGroupPathId,
    updater: MVT_Updater<MVT_ColumnFiltersState>,
  ) => void
  setGlobalFilter: (pathId: MVT_ServerGroupPathId, value: unknown) => void
}

export const createMVT_ServerGroupingManager = <TData extends MVT_RowData>(
  table: MVT_TableInstance<TData>,
  /**
   * Reader for the user-controlled `state.serverGroupingExpanded` slice.
   * Injected by `useMVT_TableInstance` to avoid reading back the merged state
   * object (which would recurse); defaults to reading `table.options.state`.
   */
  controlledExpandedReader?: () => MVT_ServerGroupingExpandedState | undefined,
  /** Same, for the controlled `state.serverGroupingSelectAll` slice. */
  controlledSelectAllReader?: () => MVT_ServerGroupingSelectAllState | undefined,
): MVT_ServerGroupingManager<TData> | undefined => {
  const serverGroupingOptions = table.options.serverGrouping
  if (!serverGroupingOptions?.provider || serverGroupingOptions.enabled === false) {
    return undefined
  }
  const options = serverGroupingOptions as MVT_ServerGroupingOptions<TData, any, any, any>
  const provider = options.provider
  const sortingMode = options.sortingMode ?? 'independent'
  const filteringMode = options.filteringMode ?? 'shared'
  const cacheOptions = {
    enabled: options.cache?.enabled ?? false,
    gcTime: options.cache?.gcTime ?? 300_000,
    keepCollapsedGroups: options.cache?.keepCollapsedGroups ?? true,
    staleTime: options.cache?.staleTime ?? 0,
  }
  const configuredPageSize = options.pagination?.defaultPageSize ?? options.initialPageSize ?? 10
  let defaultPageSize = configuredPageSize
  if (!Number.isInteger(configuredPageSize) || configuredPageSize <= 0) {
    // oxlint-disable-next-line no-console
    console.warn(
      `[mantine-vue-table] serverGrouping page size ${JSON.stringify(configuredPageSize)} ` +
        'is invalid — expected a positive integer. Falling back to 10.',
    )
    defaultPageSize = 10
  }

  const pathStates = ref<Record<MVT_ServerGroupPathId, MVT_ServerGroupingPathState<TData>>>({})
  const internalExpanded = ref<MVT_ServerGroupingExpandedState>(
    (table.options.initialState as any)?.serverGroupingExpanded ?? {},
  )
  const internalSelectAll = ref<MVT_ServerGroupingSelectAllState>(
    (table.options.initialState as any)?.serverGroupingSelectAll ?? {
      active: false,
      excludedRowIds: [],
    },
  )
  const nodeRegistry = new Map<MVT_ServerGroupPathId, MVT_ServerGroupPathItem>()
  const controllers = new Map<MVT_ServerGroupPathId, AbortController>()
  const versions = new Map<MVT_ServerGroupPathId, number>()
  const cache = new Map<string, CacheEntry>()
  const rowCache = new Map<MVT_ServerGroupPathId, { rows: MVT_Row<TData>[]; source: TData[] }>()

  const readControlledExpanded: () => MVT_ServerGroupingExpandedState | undefined =
    controlledExpandedReader ??
    (() =>
      (table.options.state as any)?.serverGroupingExpanded as
        | MVT_ServerGroupingExpandedState
        | undefined)

  const isExpandedControlled = readControlledExpanded() !== undefined

  const getExpanded = (): MVT_ServerGroupingExpandedState =>
    readControlledExpanded() ?? internalExpanded.value

  const setExpanded = (updater: MVT_Updater<MVT_ServerGroupingExpandedState>) => {
    const next = updater instanceof Function ? updater(getExpanded()) : updater
    const onChange = (table.options as any).onServerGroupingExpandedChange
    if (onChange) {
      onChange(next)
    }
    if (!isExpandedControlled) {
      internalExpanded.value = next
    }
  }

  const isExpanded = (pathId: MVT_ServerGroupPathId) => getExpanded()[pathId] === true

  // Falling back from an injected reader to `table.options.state` would recurse
  // through the merged state getter.
  const readControlledSelectAll: () => MVT_ServerGroupingSelectAllState | undefined =
    controlledSelectAllReader ??
    (() =>
      (table.options.state as any)?.serverGroupingSelectAll as
        | MVT_ServerGroupingSelectAllState
        | undefined)

  const isSelectAllControlled = readControlledSelectAll() !== undefined

  const getSelectAll = (): MVT_ServerGroupingSelectAllState =>
    readControlledSelectAll() ?? internalSelectAll.value

  const setSelectAll = (updater: MVT_Updater<MVT_ServerGroupingSelectAllState>) => {
    const next = updater instanceof Function ? updater(getSelectAll()) : updater
    ;(table.options as any).onServerGroupingSelectAllChange?.(next)
    if (!isSelectAllControlled) {
      internalSelectAll.value = next
    }
  }

  /** The "all matching" selection is tied to the query it was made under. */
  const resetSelectAll = () => {
    if (getSelectAll().active || getSelectAll().excludedRowIds.length) {
      setSelectAll({ active: false, excludedRowIds: [] })
    }
  }

  const getGroupingFields = (): string[] =>
    options.grouping ?? (table.getState().grouping as string[] | undefined) ?? []

  const setPathState = (
    pathId: MVT_ServerGroupPathId,
    state: MVT_ServerGroupingPathState<TData>,
  ) => {
    pathStates.value = { ...pathStates.value, [pathId]: state }
  }

  const getPathState = (pathId: MVT_ServerGroupPathId) => pathStates.value[pathId]

  /**
   * Table rows for one loaded record page. Rows are created (and cached) here
   * rather than in the renderer so row ids — and therefore selection state —
   * have a single source of truth shared by the body, the header checkbox, and
   * the public selection APIs.
   */
  const getRecordRows = (pathId: MVT_ServerGroupPathId): MVT_Row<TData>[] => {
    const state = getPathState(pathId)
    if (!state || state.kind !== 'records' || !state.rows) return []
    const cached = rowCache.get(pathId)
    if (cached && cached.source === state.rows) return cached.rows as MVT_Row<TData>[]
    const depth = getServerGroupPathDepth(pathId)
    const rows = state.rows.map((original, index) => {
      const rowId =
        provider.getRowId?.(original) ??
        table.options.getRowId?.(original, index, undefined as any) ??
        `${pathId}::${index}`
      return createTanstackRow(
        table as any,
        rowId,
        original,
        index,
        depth,
      ) as unknown as MVT_Row<TData>
    })
    rowCache.set(pathId, { rows, source: state.rows })
    return rows
  }

  /**
   * Every loaded record row that is currently visible — i.e. inside expanded
   * groups on the current pages. Records in collapsed or never-loaded groups
   * are deliberately excluded, so selection can never reach them.
   */
  const getVisibleRecordRows = (): MVT_Row<TData>[] =>
    Object.keys(pathStates.value)
      .filter((pathId) => pathStates.value[pathId]?.kind === 'records' && isPathVisible(pathId))
      .flatMap((pathId) => getRecordRows(pathId))

  const getNode = (pathId: MVT_ServerGroupPathId): MVT_ServerGroupNode | undefined => {
    const item = nodeRegistry.get(pathId)
    if (!item) return undefined
    return {
      count: undefined,
      id: item.id,
      label: item.label,
      meta: item.meta,
      original: item.original,
      value: item.value,
      ...(item as any).__node,
    }
  }

  const getParentItems = (pathId: MVT_ServerGroupPathId): MVT_ServerGroupPathItem[] => {
    if (pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID) return []
    const segments = pathId.split('/')
    const items: MVT_ServerGroupPathItem[] = []
    for (let index = 0; index < segments.length; index++) {
      const ancestorPathId = segments.slice(0, index + 1).join('/')
      const item = nodeRegistry.get(ancestorPathId)
      if (item) items.push(item)
    }
    return items
  }

  const getEffectiveSorting = (
    pathId: MVT_ServerGroupPathId,
    kind: 'groups' | 'records',
  ): MVT_SortingState => {
    const override = getPathState(pathId)?.sorting
    if (override) return override
    const tableSorting = (table.getState().sorting as MVT_SortingState | undefined) ?? []
    if (sortingMode === 'shared') return tableSorting
    if (sortingMode === 'records-only') return kind === 'records' ? tableSorting : []
    // In independent mode, table-header sorting drives only the root level.
    return pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID ? tableSorting : []
  }

  const getEffectiveFilters = (
    pathId: MVT_ServerGroupPathId,
    kind: 'groups' | 'records',
  ): { columnFilters: MVT_ColumnFiltersState; globalFilter: unknown } => {
    const state = getPathState(pathId)
    if (state?.columnFilters || state?.globalFilter !== undefined) {
      return {
        columnFilters: state.columnFilters ?? [],
        globalFilter: state.globalFilter,
      }
    }
    if (filteringMode === 'independent') {
      return { columnFilters: [], globalFilter: undefined }
    }
    if (filteringMode === 'records-only' && kind !== 'records') {
      return { columnFilters: [], globalFilter: undefined }
    }
    const tableState = table.getState()
    return {
      columnFilters: (tableState.columnFilters as MVT_ColumnFiltersState | undefined) ?? [],
      globalFilter: tableState.globalFilter,
    }
  }

  const isRootPath = (pathId: MVT_ServerGroupPathId) => pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID

  const getDefaultPagination = (): MVT_ServerPageState => ({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  /**
   * Effective pagination of a path. The root level is driven by the table's
   * own `pagination` state, so the standard bottom toolbar (page navigation +
   * rows-per-page) controls it exactly like an ungrouped server-side table.
   * Nested levels keep their own independent, fixed-page-size state.
   */
  const getEffectivePagination = (pathId: MVT_ServerGroupPathId): MVT_ServerPageState => {
    if (isRootPath(pathId)) {
      const { pageIndex, pageSize } = table.getState().pagination
      return { ...getPathState(pathId)?.pagination, pageIndex, pageSize }
    }
    return getPathState(pathId)?.pagination ?? getDefaultPagination()
  }

  /** Reset a path to page 0. Returns `true` when it triggered a root reload. */
  const resetPageIndex = (pathId: MVT_ServerGroupPathId): boolean => {
    if (isRootPath(pathId)) {
      const { pageIndex } = table.getState().pagination
      if (pageIndex === 0) return false
      table.setPageIndex(0)
      return true
    }
    const state = getPathState(pathId)
    if (state) {
      setPathState(pathId, {
        ...state,
        pagination: { ...state.pagination, cursor: undefined, pageIndex: 0 },
      })
    }
    return false
  }

  const buildRequest = (
    pathId: MVT_ServerGroupPathId,
    kind: 'groups' | 'records',
    signal: AbortSignal,
  ): MVT_ServerGroupRequest<any> | MVT_ServerRecordRequest<any> => {
    const grouping = getGroupingFields()
    const depth = getServerGroupPathDepth(pathId)
    const parentGroups = getParentItems(pathId)
    const { columnFilters, globalFilter } = getEffectiveFilters(pathId, kind)
    const base = {
      columnFilters,
      depth,
      globalFilter,
      grouping,
      pagination: getEffectivePagination(pathId),
      parentGroup: parentGroups.at(-1),
      parentGroups,
      pathId,
      signal,
      sorting: getEffectiveSorting(pathId, kind),
      table: table as MVT_TableInstance<any>,
    }
    return kind === 'groups' ? { ...base, groupingField: grouping[depth] } : base
  }

  const getCacheKey = (
    request: MVT_ServerGroupRequest<any> | MVT_ServerRecordRequest<any>,
  ): string =>
    serializeServerGroupingCacheKey([
      request.pathId,
      request.grouping,
      request.depth,
      request.pagination,
      request.sorting,
      request.columnFilters,
      request.globalFilter ?? null,
      ...(provider.getCacheKey?.(request) ?? []),
    ])

  const gcCache = () => {
    const now = Date.now()
    cache.forEach((entry, key) => {
      if (now - entry.updatedAt > cacheOptions.gcTime) cache.delete(key)
    })
  }

  const load = (pathId: MVT_ServerGroupPathId) => {
    const grouping = getGroupingFields()
    const depth = getServerGroupPathDepth(pathId)
    const kind: 'groups' | 'records' = depth >= grouping.length ? 'records' : 'groups'
    const previous = getPathState(pathId)
    const hasData = previous?.groups !== undefined || previous?.rows !== undefined

    controllers.get(pathId)?.abort()
    const controller = new AbortController()
    controllers.set(pathId, controller)
    const version = (versions.get(pathId) ?? 0) + 1
    versions.set(pathId, version)

    const request = buildRequest(pathId, kind, controller.signal)
    const isCurrent = () => versions.get(pathId) === version && !controller.signal.aborted

    let servedFromCache = false
    let cacheKey: string | undefined
    if (cacheOptions.enabled) {
      cacheKey = getCacheKey(request)
      const entry = cache.get(cacheKey)
      if (entry) {
        servedFromCache = true
        const fresh = Date.now() - entry.updatedAt <= cacheOptions.staleTime
        setPathState(pathId, {
          ...entry.payload,
          columnFilters: previous?.columnFilters,
          depth,
          error: null,
          globalFilter: previous?.globalFilter,
          isFetching: !fresh,
          isLoading: false,
          pagination: request.pagination,
          pathId,
          sorting: previous?.sorting,
          updatedAt: entry.updatedAt,
        } as MVT_ServerGroupingPathState<TData>)
        if (entry.payload.kind === 'groups') {
          registerGroups(pathId, entry.payload.groups ?? [], grouping[depth], depth)
        }
        if (fresh) return //fresh cache hit — no request
      }
    }

    if (!servedFromCache) {
      setPathState(pathId, {
        ...previous,
        columnFilters: previous?.columnFilters,
        depth,
        error: null,
        groups: kind === 'groups' ? previous?.groups : undefined,
        isFetching: true,
        isLoading: !hasData,
        kind,
        pagination: request.pagination,
        pathId,
        rowCount: previous?.rowCount ?? 0,
        rows: kind === 'records' ? previous?.rows : undefined,
        sorting: previous?.sorting,
      } as MVT_ServerGroupingPathState<TData>)
    }

    const eventPayload = { path: request.parentGroups, pathId }
    options.onGroupLoadStart?.({ ...eventPayload, request })

    const promise =
      kind === 'groups'
        ? provider.loadGroups(request as MVT_ServerGroupRequest<any>)
        : provider.loadRecords(request as MVT_ServerRecordRequest<any>)

    Promise.resolve(promise)
      .then((response) => {
        if (!isCurrent()) return //stale response , a newer request owns this path
        const updatedAt = Date.now()
        let payload: CacheEntry['payload']
        if (kind === 'groups') {
          const context = {
            depth,
            field: grouping[depth],
            request: request as MVT_ServerGroupRequest<any>,
          }
          const rawGroups = provider.getGroups(response) ?? []
          const groups: MVT_ServerGroupNode[] = rawGroups.map((group: any) => ({
            count: provider.getGroupCount?.(group, context),
            hasChildren: provider.hasGroupChildren?.(group, context) ?? true,
            id: provider.getGroupId(group, context),
            label: provider.getGroupLabel(group, context),
            meta: provider.getGroupMeta?.(group, context) ?? {},
            original: group,
            value: provider.getGroupValue ? provider.getGroupValue(group, context) : group,
          }))
          registerGroups(pathId, groups, grouping[depth], depth)
          payload = { groups, kind, rowCount: provider.getGroupRowCount(response) }
          options.onGroupLoadSuccess?.({
            ...eventPayload,
            groups,
            request: request as MVT_ServerGroupRequest<any>,
            response,
          })
        } else {
          const rows = provider.getRecords(response) ?? []
          payload = { kind, rowCount: provider.getRecordRowCount(response), rows }
          options.onRecordLoadSuccess?.({
            ...eventPayload,
            request: request as MVT_ServerRecordRequest<any>,
            response,
            rows,
          })
        }
        setPathState(pathId, {
          ...getPathState(pathId)!,
          ...payload,
          error: null,
          isFetching: false,
          isLoading: false,
          updatedAt,
        } as MVT_ServerGroupingPathState<TData>)
        if (cacheOptions.enabled && cacheKey) {
          cache.set(cacheKey, { pathId, payload, updatedAt })
          gcCache()
        }
      })
      .catch((error) => {
        if (!isCurrent() || isAbortError(error)) return
        setPathState(pathId, {
          ...getPathState(pathId)!,
          error,
          isFetching: false,
          isLoading: false,
        })
        options.onError?.({ ...eventPayload, error, request })
      })
  }

  const registerGroups = (
    parentPathId: MVT_ServerGroupPathId,
    groups: MVT_ServerGroupNode[],
    field: string,
    depth: number,
  ) => {
    groups.forEach((node) => {
      const childPathId = createServerGroupPathId(parentPathId, field, node.id)
      const item: MVT_ServerGroupPathItem = {
        depth,
        field,
        id: node.id,
        label: node.label,
        meta: node.meta,
        original: node.original,
        value: node.value,
      }
      ;(item as any).__node = node
      nodeRegistry.set(childPathId, item)
    })
  }

  const ensureLoaded = (pathId: MVT_ServerGroupPathId) => {
    const state = getPathState(pathId)
    if (!state || (state.groups === undefined && state.rows === undefined && !state.isFetching)) {
      load(pathId)
    }
  }

  const isPathVisible = (pathId: MVT_ServerGroupPathId): boolean => {
    if (pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID) return true
    const segments = pathId.split('/')
    // Every segment, including the path that owns the content, must be expanded.
    for (let index = 0; index < segments.length; index++) {
      const ancestor = segments.slice(0, index + 1).join('/')
      if (!isExpanded(ancestor)) return false
    }
    return true
  }

  const getLoadedVisiblePaths = (): MVT_ServerGroupPathId[] =>
    Object.keys(pathStates.value).filter(isPathVisible)

  const abortPathAndDescendants = (pathId: MVT_ServerGroupPathId) => {
    controllers.forEach((controller, key) => {
      if (!isServerGroupPathOrDescendant(key, pathId)) return
      controller.abort()
      // Clear the fetching flags that the ignored abort would otherwise leave behind.
      const state = getPathState(key)
      if (state?.isFetching || state?.isLoading) {
        setPathState(key, { ...state, isFetching: false, isLoading: false })
      }
    })
  }

  const dropPathAndDescendants = (pathId: MVT_ServerGroupPathId) => {
    const next = { ...pathStates.value }
    Object.keys(next).forEach((key) => {
      if (isServerGroupPathOrDescendant(key, pathId)) delete next[key]
    })
    pathStates.value = next
    cache.forEach((entry, key) => {
      if (isServerGroupPathOrDescendant(entry.pathId, pathId)) cache.delete(key)
    })
    rowCache.forEach((_entry, key) => {
      if (isServerGroupPathOrDescendant(key, pathId)) rowCache.delete(key)
    })
  }

  const expand = (pathId: MVT_ServerGroupPathId) => {
    if (isExpanded(pathId)) return
    setExpanded((prev) => ({ ...prev, [pathId]: true }))
  }

  const collapse = (pathId: MVT_ServerGroupPathId) => {
    if (!isExpanded(pathId)) return
    setExpanded((prev) => ({ ...prev, [pathId]: false }))
  }

  const toggle = (pathId: MVT_ServerGroupPathId) => {
    if (isExpanded(pathId)) collapse(pathId)
    else expand(pathId)
  }

  const invalidate = (pathId?: MVT_ServerGroupPathId) => {
    if (pathId === undefined) {
      cache.clear()
    } else {
      cache.forEach((entry, key) => {
        if (isServerGroupPathOrDescendant(entry.pathId, pathId)) cache.delete(key)
      })
    }
  }

  const reload = (pathId?: MVT_ServerGroupPathId) => {
    if (pathId !== undefined) {
      invalidate(pathId)
      if (getPathState(pathId)) load(pathId)
      return
    }
    invalidate()
    getLoadedVisiblePaths().forEach((visiblePathId) => load(visiblePathId))
  }

  const retry = (pathId: MVT_ServerGroupPathId) => {
    load(pathId)
  }

  const reset = () => {
    controllers.forEach((controller) => controller.abort())
    controllers.clear()
    versions.clear()
    nodeRegistry.clear()
    cache.clear()
    rowCache.clear()
    pathStates.value = {}
    if (options.resetExpansionOnGroupingChange !== false) {
      setExpanded({})
    }
    load(MVT_SERVER_GROUPING_ROOT_PATH_ID)
  }

  const setPagination: MVT_ServerGroupingManager<TData>['setPagination'] = (pathId, updater) => {
    const previous = getEffectivePagination(pathId)
    const next = updater instanceof Function ? updater(previous) : { ...previous, ...updater }
    // Root pagination comes from the table; provider cursor metadata stays per path.
    if (isRootPath(pathId)) {
      const state = getPathState(pathId)
      if (state) setPathState(pathId, { ...state, pagination: next })
      const current = table.getState().pagination
      if (current.pageIndex === next.pageIndex && current.pageSize === next.pageSize) {
        load(pathId) //only the cursor changed — the watcher would not fire
      } else {
        table.setPagination({ pageIndex: next.pageIndex, pageSize: next.pageSize })
      }
      return
    }
    const state = getPathState(pathId)
    if (state) {
      setPathState(pathId, { ...state, pagination: next })
    } else {
      setPathState(pathId, {
        depth: getServerGroupPathDepth(pathId),
        error: null,
        isFetching: false,
        isLoading: false,
        kind: getServerGroupPathDepth(pathId) >= getGroupingFields().length ? 'records' : 'groups',
        pagination: next,
        pathId,
        rowCount: 0,
      })
    }
    load(pathId)
  }

  const setSorting: MVT_ServerGroupingManager<TData>['setSorting'] = (pathId, updater) => {
    const state = getPathState(pathId)
    const previous = state?.sorting ?? []
    const next = updater instanceof Function ? updater(previous) : updater
    if (!state) return
    setPathState(pathId, { ...state, sorting: next })
    if (!resetPageIndex(pathId)) load(pathId)
  }

  const setColumnFilters: MVT_ServerGroupingManager<TData>['setColumnFilters'] = (
    pathId,
    updater,
  ) => {
    const state = getPathState(pathId)
    if (!state) return
    const previous = state.columnFilters ?? []
    const next = updater instanceof Function ? updater(previous) : updater
    setPathState(pathId, { ...state, columnFilters: next })
    if (!resetPageIndex(pathId)) load(pathId)
  }

  const setGlobalFilter: MVT_ServerGroupingManager<TData>['setGlobalFilter'] = (pathId, value) => {
    const state = getPathState(pathId)
    if (!state) return
    setPathState(pathId, { ...state, globalFilter: value })
    if (!resetPageIndex(pathId)) load(pathId)
  }

  const getState = (): MVT_ServerGroupingState<TData> => ({
    enabled: true,
    expanded: getExpanded(),
    grouping: getGroupingFields(),
    paths: pathStates.value,
  })

  watch(
    () => ({ ...getExpanded() }),
    (next, prev) => {
      Object.keys(next).forEach((pathId) => {
        if (next[pathId] && !prev?.[pathId]) {
          options.onGroupExpand?.({
            group: getNode(pathId)!,
            path: getParentItems(pathId),
            pathId,
          })
          ensureLoaded(pathId)
        }
      })
      Object.keys(prev ?? {}).forEach((pathId) => {
        if (prev?.[pathId] && !next[pathId]) {
          options.onGroupCollapse?.({
            group: getNode(pathId)!,
            path: getParentItems(pathId),
            pathId,
          })
          abortPathAndDescendants(pathId)
          // Opt-in: collapsing also drops the selection of descendant records.
          if (options.selection?.clearOnCollapse) {
            deselectServerGroupingRecords(
              table as MVT_TableInstance<any>,
              Object.keys(pathStates.value)
                .filter(
                  (key) =>
                    pathStates.value[key]?.kind === 'records' &&
                    isServerGroupPathOrDescendant(key, pathId),
                )
                .flatMap((key) => getRecordRows(key).map((row) => row.id)),
            )
          }
          if (!cacheOptions.keepCollapsedGroups) {
            dropPathAndDescendants(pathId)
          }
        }
      })
    },
  )

  watch(
    () => JSON.stringify(getGroupingFields()),
    (next, prev) => {
      if (next !== prev) {
        resetSelectAll()
        reset()
      }
    },
  )

  watch(
    () =>
      JSON.stringify([table.getState().columnFilters ?? [], table.getState().globalFilter ?? null]),
    (next, prev) => {
      if (next === prev || filteringMode === 'independent') return
      // An all-matching selection belongs to the query under which it was created.
      resetSelectAll()
      invalidate()
      const affected = getLoadedVisiblePaths().filter(
        (pathId) => filteringMode === 'shared' || getPathState(pathId)?.kind === 'records',
      )
      affected.forEach((pathId) => {
        const state = getPathState(pathId)!
        // Avoid displaying results from the previous filter state.
        setPathState(pathId, { ...state, groups: undefined, rows: undefined })
        // Avoid a duplicate reload when resetting the root page triggers its watcher.
        if (!resetPageIndex(pathId)) load(pathId)
      })
    },
  )

  watch(
    () => JSON.stringify(table.getState().sorting ?? []),
    (next, prev) => {
      if (next === prev) return
      const affected = getLoadedVisiblePaths().filter((pathId) => {
        if (getPathState(pathId)?.sorting) return false //per-path override wins
        if (sortingMode === 'shared') return true
        if (sortingMode === 'records-only') return getPathState(pathId)?.kind === 'records'
        return pathId === MVT_SERVER_GROUPING_ROOT_PATH_ID
      })
      affected.forEach((pathId) => {
        if (!resetPageIndex(pathId)) load(pathId)
      })
    },
  )

  // Root pagination follows the table state so the standard bottom toolbar drives it.
  watch(
    () => {
      const { pageIndex, pageSize } = table.getState().pagination
      return `${pageIndex}:${pageSize}`
    },
    (next, prev) => {
      if (next !== prev) load(MVT_SERVER_GROUPING_ROOT_PATH_ID)
    },
  )

  load(MVT_SERVER_GROUPING_ROOT_PATH_ID)

  if (getCurrentScope()) {
    onScopeDispose(() => {
      controllers.forEach((controller) => controller.abort())
      controllers.clear()
    })
  }

  return {
    collapse,
    ensureLoaded,
    expand,
    getExpanded,
    getGroupingFields,
    getNode,
    getParentItems,
    getPathState,
    getRecordRows,
    getSelectAll,
    getState,
    getVisibleRecordRows,
    invalidate,
    isExpanded,
    options,
    reload,
    reset,
    retry,
    setColumnFilters,
    setExpanded,
    setGlobalFilter,
    setSelectAll,
    setPagination,
    setSorting,
    toggle,
  }
}
