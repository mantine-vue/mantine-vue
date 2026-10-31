import { FileManagerError, throwIfAborted, toFileErrorInfo } from '../core/errors'
import { getFileCategory, getMimeType } from '../core/file-types'
import { getAvailableName, getFileNameIssue } from '../core/paths'
import { matchesFilters, matchesQuery, sortEntries } from '../core/sort-filter'
import type {
  FileBulkResult,
  FileConflictStrategy,
  FileEntry,
  FileEntryPermissions,
  FileMetadataValue,
  FilePageRequest,
  FilePageResult,
  FileSystemAdapter,
  FileSystemCapabilities,
  FileTimestamp,
  FileUploadRequest,
  FileUploadSession,
} from '../types'
import { createZipArchive, type ZipEntry } from './zip'

/** Description of a file or folder used to seed the in-memory file system. */
export interface MemoryFileSeed {
  /** Generated when omitted. */
  id?: string
  name: string

  /** An entry with `children` is a folder, regardless of this field. */
  kind?: FileEntry['kind']

  children?: MemoryFileSeed[]

  /** Text or binary content used by preview and download. */
  content?: string | Blob

  /** Url used by the preview instead of `content`. */
  url?: string

  /** Size in bytes. Derived from `content` when omitted. */
  size?: number

  mimeType?: string
  createdAt?: FileTimestamp
  modifiedAt?: FileTimestamp
  thumbnailUrl?: string
  starred?: boolean
  owner?: string
  permissions?: FileEntryPermissions
  metadata?: Record<string, FileMetadataValue>
}

export interface MemoryFileSystemOptions {
  /** Content of the root folder. */
  files?: MemoryFileSeed[]

  /** Name of the root folder. @default 'Home' */
  rootName?: string

  /** Simulated delay of every request in ms, or a `[min, max]` range. @default 0 */
  latency?: number | [number, number]

  /** Storage limit in bytes, reported as `quota-exceeded` when an upload exceeds it. */
  quota?: number

  /** Turns features off, to demonstrate or test capability detection. */
  capabilities?: Partial<FileSystemCapabilities>

  /** Called before every request. Throw from it to simulate a failing backend. */
  onRequest?: (operation: string, request: unknown) => void | Promise<void>
}

/** The adapter plus helpers for tests and demos. */
export interface MemoryFileSystem extends FileSystemAdapter {
  /** Every live entry, keyed by id. Trashed entries are included. */
  getEntries: () => FileEntry[]

  /** Finds a live entry by its location, such as `/Documents/report.pdf`. */
  findByPath: (path: string) => FileEntry | undefined
}

interface MemoryNode {
  entry: FileEntry
  content?: string | Blob
  url?: string
  trashedFrom?: string | null
}

interface MemoryUploadSession extends FileUploadSession {
  request: FileUploadRequest
  chunks: Blob[]
}

const ROOT_ID = 'root'

function toBlob(content: string | Blob | undefined, mimeType?: string) {
  if (content instanceof Blob) {
    return content
  }

  return new Blob([content ?? ''], { type: mimeType ?? 'text/plain' })
}

function getContentSize(content: string | Blob | undefined) {
  if (content === undefined) {
    return undefined
  }

  return content instanceof Blob ? content.size : new TextEncoder().encode(content).length
}

/** Fully functional file system kept in memory, for demos, tests and prototypes. */
export function createMemoryAdapter(options: MemoryFileSystemOptions = {}): MemoryFileSystem {
  const { latency = 0, quota, onRequest } = options
  const nodes = new Map<string, MemoryNode>()
  const sessions = new Map<string, MemoryUploadSession>()
  let nextId = 1

  const now = () => new Date().toISOString()
  const createId = () => {
    let id = `node-${nextId}`

    while (nodes.has(id)) {
      nextId += 1
      id = `node-${nextId}`
    }

    nextId += 1
    return id
  }

  nodes.set(ROOT_ID, {
    entry: {
      id: ROOT_ID,
      name: options.rootName ?? 'Home',
      kind: 'folder',
      parentId: null,
      path: '/',
      permissions: { rename: false, delete: false, move: false, copy: false },
    },
  })

  function seed(files: MemoryFileSeed[], parentId: string) {
    for (const file of files) {
      const kind = file.kind ?? (file.children ? 'folder' : 'file')
      const id = file.id ?? createId()
      const mimeType = file.mimeType ?? (kind === 'file' ? getMimeType(file.name) : undefined)
      const stamp = file.modifiedAt ?? now()

      nodes.set(id, {
        content: file.content,
        url: file.url,
        entry: {
          id,
          name: file.name,
          kind,
          parentId,
          size: kind === 'file' ? (file.size ?? getContentSize(file.content) ?? 0) : undefined,
          mimeType,
          createdAt: file.createdAt ?? stamp,
          modifiedAt: stamp,
          thumbnailUrl: file.thumbnailUrl,
          starred: file.starred,
          owner: file.owner,
          permissions: file.permissions,
          metadata: file.metadata,
        },
      })

      if (file.children) {
        seed(file.children, id)
      }
    }
  }

  seed(options.files ?? [], ROOT_ID)

  function delay(signal: AbortSignal | undefined) {
    const duration = Array.isArray(latency)
      ? latency[0] + Math.random() * (latency[1] - latency[0])
      : latency

    throwIfAborted(signal)

    if (duration <= 0) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      const onAbort = () => {
        clearTimeout(timeout)
        reject(new FileManagerError('aborted', 'The operation was canceled'))
      }
      const timeout = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort)
        resolve()
      }, duration)

      signal?.addEventListener('abort', onAbort, { once: true })
    })
  }

  async function begin(operation: string, request: { signal?: AbortSignal }) {
    await delay(request.signal)
    await onRequest?.(operation, request)
  }

  function getNode(id: string | null) {
    const node = nodes.get(id ?? ROOT_ID)

    if (!node) {
      throw new FileManagerError('not-found', `Item ${id} does not exist`)
    }

    return node
  }

  function getFolder(id: string | null) {
    const node = getNode(id)

    if (node.entry.kind !== 'folder') {
      throw new FileManagerError('invalid-operation', `${node.entry.name} is not a folder`)
    }

    if (node.entry.trashedAt) {
      throw new FileManagerError('not-found', `${node.entry.name} is in the trash`)
    }

    return node
  }

  function assertPermission(entry: FileEntry, permission: keyof FileEntryPermissions) {
    if (entry.permissions?.[permission] === false) {
      throw new FileManagerError('permission-denied', `You cannot ${permission} ${entry.name}`)
    }
  }

  function getChildren(parentId: string) {
    return [...nodes.values()].filter(
      (node) => node.entry.parentId === parentId && !node.entry.trashedAt,
    )
  }

  function getLocation(entry: FileEntry): string {
    if (entry.parentId === null) {
      return '/'
    }

    const parent = nodes.get(entry.parentId)?.entry
    const parentPath = parent ? getLocation(parent) : '/'

    return parentPath === '/' ? `/${entry.name}` : `${parentPath}/${entry.name}`
  }

  /** Copies an entry out of the store with its derived fields, so callers cannot mutate it. */
  function toEntry(node: MemoryNode): FileEntry {
    const children = node.entry.kind === 'folder' ? getChildren(node.entry.id) : []

    return {
      ...node.entry,
      path: getLocation(node.entry),
      ...(node.entry.kind === 'folder'
        ? {
            childCount: children.length,
            hasChildren: children.some((child) => child.entry.kind === 'folder'),
          }
        : null),
    }
  }

  function getAncestors(entry: FileEntry) {
    const ancestors: FileEntry[] = []
    let parentId = entry.parentId

    while (parentId !== null) {
      const parent = getNode(parentId)
      ancestors.unshift(toEntry(parent))
      parentId = parent.entry.parentId
    }

    return ancestors
  }

  function assertUniqueName(parentId: string, name: string, ignoreId?: string) {
    const existing = findByName(parentId, name)

    if (existing && existing.entry.id !== ignoreId) {
      throw new FileManagerError('conflict', `${name} already exists`, {
        conflictWith: toEntry(existing),
      })
    }
  }

  function findByName(parentId: string, name: string) {
    const normalized = name.toLowerCase()

    return getChildren(parentId).find((node) => node.entry.name.toLowerCase() === normalized)
  }

  function assertValidName(name: string) {
    if (getFileNameIssue(name)) {
      throw new FileManagerError('invalid-name', `"${name}" is not a valid name`)
    }
  }

  function getSubtree(id: string): MemoryNode[] {
    const node = getNode(id)

    return [
      node,
      ...[...nodes.values()]
        .filter((child) => child.entry.parentId === id)
        .flatMap((child) => getSubtree(child.entry.id)),
    ]
  }

  function removeSubtree(id: string) {
    getSubtree(id).forEach((node) => nodes.delete(node.entry.id))
  }

  function isInsideSubtree(targetId: string, id: string) {
    for (let current: string | null = targetId; current !== null; ) {
      if (current === id) {
        return true
      }

      current = getNode(current).entry.parentId
    }

    return false
  }

  function getUsedBytes() {
    return [...nodes.values()].reduce((total, node) => total + (node.entry.size ?? 0), 0)
  }

  function assertQuota(size: number) {
    if (quota !== undefined && getUsedBytes() + size > quota) {
      throw new FileManagerError('quota-exceeded', 'The storage quota is exceeded')
    }
  }

  /** Settles a name collision, returning the final name or `null` when the item is skipped. */
  function resolveName(
    parentId: string,
    name: string,
    strategy: FileConflictStrategy,
    ignoreId?: string,
  ) {
    const existing = findByName(parentId, name)

    if (!existing || existing.entry.id === ignoreId) {
      return name
    }

    switch (strategy) {
      case 'skip':
        return null
      case 'rename':
        return getAvailableName(name, (candidate) => {
          const taken = findByName(parentId, candidate)
          return !!taken && taken.entry.id !== ignoreId
        })
      case 'overwrite':
        if (existing.entry.kind === 'folder') {
          throw new FileManagerError('conflict', `${name} is a folder and cannot be overwritten`, {
            conflictWith: toEntry(existing),
          })
        }

        assertPermission(existing.entry, 'write')
        removeSubtree(existing.entry.id)
        return name
      default:
        throw new FileManagerError('conflict', `${name} already exists`, {
          conflictWith: toEntry(existing),
        })
    }
  }

  /** Runs one step per id and collects the per-item outcome, the contract of bulk methods. */
  function runBulk(ids: string[], step: (id: string, result: FileBulkResult) => void) {
    const result: FileBulkResult = { succeeded: [], failed: [], skipped: [] }

    for (const id of ids) {
      try {
        step(id, result)
      } catch (error) {
        result.failed.push({ id, name: nodes.get(id)?.entry.name, error: toFileErrorInfo(error) })
      }
    }

    return result
  }

  function paginate(entries: FileEntry[], request: FilePageRequest): FilePageResult {
    const sorted = request.sort ? sortEntries(entries, request.sort) : entries
    const offset = request.cursor ? Number(request.cursor) : 0
    const end = request.limit ? offset + request.limit : sorted.length

    return {
      items: sorted.slice(offset, end),
      nextCursor: end < sorted.length ? String(end) : null,
      total: sorted.length,
    }
  }

  function cloneSubtree(id: string, parentId: string, name: string): MemoryNode {
    const source = getNode(id)
    const stamp = now()
    const clone: MemoryNode = {
      content: source.content,
      url: source.url,
      entry: {
        ...source.entry,
        id: createId(),
        parentId,
        name,
        starred: false,
        createdAt: stamp,
        modifiedAt: stamp,
      },
    }

    nodes.set(clone.entry.id, clone)

    // Listed before cloning, so a folder duplicated into itself does not recurse forever.
    for (const child of getChildren(id)) {
      cloneSubtree(child.entry.id, clone.entry.id, child.entry.name)
    }

    return clone
  }

  /** Walks `relativePath`, creating missing folders, and returns the folder of the last segment. */
  function ensureFolders(parentId: string, segments: string[]) {
    let current = parentId

    for (const segment of segments) {
      const existing = findByName(current, segment)

      if (existing?.entry.kind === 'folder') {
        current = existing.entry.id
      } else if (existing) {
        throw new FileManagerError('conflict', `${segment} already exists and is not a folder`)
      } else {
        const stamp = now()
        const id = createId()

        nodes.set(id, {
          entry: {
            id,
            name: segment,
            kind: 'folder',
            parentId: current,
            createdAt: stamp,
            modifiedAt: stamp,
          },
        })
        current = id
      }
    }

    return current
  }

  function writeFile(request: FileUploadRequest, content: Blob) {
    const segments = (request.relativePath ?? request.file.name).split('/')
    const fileName = segments.pop() ?? request.file.name
    const destination = getFolder(request.parentId)

    assertPermission(destination.entry, 'write')
    assertValidName(fileName)
    assertQuota(content.size)

    const parentId = ensureFolders(destination.entry.id, segments)
    const name = resolveName(parentId, fileName, request.conflict)

    if (name === null) {
      throw new FileManagerError('conflict', `${fileName} already exists`)
    }

    const stamp = now()
    const id = createId()
    const node: MemoryNode = {
      content,
      entry: {
        id,
        name,
        kind: 'file',
        parentId,
        size: content.size,
        mimeType: request.file.type || getMimeType(name),
        createdAt: stamp,
        modifiedAt: stamp,
      },
    }

    nodes.set(id, node)

    return toEntry(node)
  }

  async function collectZipEntries(id: string, prefix: string): Promise<ZipEntry[]> {
    const node = getNode(id)

    assertPermission(node.entry, 'download')

    const path = `${prefix}${node.entry.name}`

    if (node.entry.kind === 'file') {
      const blob = toBlob(node.content, node.entry.mimeType)
      return [{ path, content: new Uint8Array(await blob.arrayBuffer()) }]
    }

    const children = await Promise.all(
      getChildren(id).map((child) => collectZipEntries(child.entry.id, `${path}/`)),
    )

    return [{ path: `${path}/`, content: new Uint8Array() }, ...children.flat()]
  }

  return {
    capabilities: { folderUpload: true, serverSort: true, ...options.capabilities },

    getEntries: () => [...nodes.values()].map(toEntry),

    findByPath: (path) => {
      const node = [...nodes.values()].find((item) => getLocation(item.entry) === path)
      return node ? toEntry(node) : undefined
    },

    async list(request) {
      await begin('list', request)

      const folder = getFolder(request.folderId)

      assertPermission(folder.entry, 'read')

      const entries = getChildren(folder.entry.id)
        .map(toEntry)
        .filter((entry) => !request.foldersOnly || entry.kind === 'folder')

      return {
        ...paginate(entries, request),
        folder: toEntry(folder),
        ancestors: getAncestors(folder.entry),
      }
    },

    async get(request) {
      await begin('get', request)
      return toEntry(getNode(request.id))
    },

    async createFolder(request) {
      await begin('createFolder', request)

      const parent = getFolder(request.parentId)

      assertPermission(parent.entry, 'write')
      assertValidName(request.name)
      assertUniqueName(parent.entry.id, request.name)

      const stamp = now()
      const id = createId()
      const node: MemoryNode = {
        entry: {
          id,
          name: request.name,
          kind: 'folder',
          parentId: parent.entry.id,
          createdAt: stamp,
          modifiedAt: stamp,
        },
      }

      nodes.set(id, node)

      return toEntry(node)
    },

    async rename(request) {
      await begin('rename', request)

      const node = getNode(request.id)

      assertPermission(node.entry, 'rename')
      assertValidName(request.name)

      if (node.entry.parentId === null) {
        throw new FileManagerError('invalid-operation', 'The root folder cannot be renamed')
      }

      assertUniqueName(node.entry.parentId, request.name, node.entry.id)

      node.entry = { ...node.entry, name: request.name, modifiedAt: now() }

      return toEntry(node)
    },

    async move(request) {
      await begin('move', request)

      const target = getFolder(request.targetId)

      assertPermission(target.entry, 'write')

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        assertPermission(node.entry, 'move')

        if (isInsideSubtree(target.entry.id, id)) {
          throw new FileManagerError(
            'invalid-operation',
            `${node.entry.name} cannot be moved into itself`,
          )
        }

        if (node.entry.parentId === target.entry.id) {
          result.succeeded.push({ sourceId: id, entry: toEntry(node) })
          return
        }

        const name = resolveName(target.entry.id, node.entry.name, request.conflict, id)

        if (name === null) {
          result.skipped?.push(id)
          return
        }

        node.entry = { ...node.entry, name, parentId: target.entry.id, modifiedAt: now() }
        result.succeeded.push({ sourceId: id, entry: toEntry(node) })
      })
    },

    async copy(request) {
      await begin('copy', request)

      const target = getFolder(request.targetId)

      assertPermission(target.entry, 'write')

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        assertPermission(node.entry, 'copy')

        if (isInsideSubtree(target.entry.id, id)) {
          throw new FileManagerError(
            'invalid-operation',
            `${node.entry.name} cannot be copied into itself`,
          )
        }

        assertQuota(getSubtree(id).reduce((total, item) => total + (item.entry.size ?? 0), 0))

        const name = resolveName(target.entry.id, node.entry.name, request.conflict, undefined)

        if (name === null) {
          result.skipped?.push(id)
          return
        }

        result.succeeded.push({
          sourceId: id,
          entry: toEntry(cloneSubtree(id, target.entry.id, name)),
        })
      })
    },

    async delete(request) {
      await begin('delete', request)

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        assertPermission(node.entry, 'delete')
        removeSubtree(id)
        result.succeeded.push({ sourceId: id })
      })
    },

    async trash(request) {
      await begin('trash', request)

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        assertPermission(node.entry, 'delete')

        node.trashedFrom = node.entry.parentId
        node.entry = {
          ...node.entry,
          trashedAt: now(),
          originalPath: getLocation(node.entry),
        }
        result.succeeded.push({ sourceId: id, entry: toEntry(node) })
      })
    },

    async restore(request) {
      await begin('restore', request)

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        if (!node.entry.trashedAt) {
          throw new FileManagerError('invalid-operation', `${node.entry.name} is not in the trash`)
        }

        const originalParent = node.trashedFrom ? nodes.get(node.trashedFrom) : undefined
        const parentId =
          originalParent && !originalParent.entry.trashedAt ? originalParent.entry.id : ROOT_ID
        const name = resolveName(parentId, node.entry.name, 'rename', id) ?? node.entry.name
        const { trashedAt: _trashedAt, originalPath: _originalPath, ...entry } = node.entry

        node.entry = { ...entry, name, parentId }
        node.trashedFrom = undefined
        result.succeeded.push({ sourceId: id, entry: toEntry(node) })
      })
    },

    async listTrash(request) {
      await begin('listTrash', request)

      return paginate(
        [...nodes.values()].filter((node) => node.entry.trashedAt).map(toEntry),
        request,
      )
    },

    async emptyTrash(request) {
      await begin('emptyTrash', request)

      for (const node of Array.from(nodes.values())) {
        if (node.entry.trashedAt && nodes.has(node.entry.id)) {
          removeSubtree(node.entry.id)
        }
      }
    },

    async upload(request) {
      await begin('upload', request)

      // Progress is simulated in steps, since nothing actually travels over a network.
      for (let step = 1; step <= 4; step += 1) {
        await delay(request.signal)
        request.onProgress?.((request.file.size * step) / 4, request.file.size)
      }

      return writeFile(request, request.file)
    },

    chunkedUpload: {
      async start(request) {
        await begin('chunkedUpload.start', request)

        const existing = request.resumeId ? sessions.get(request.resumeId) : undefined

        if (existing) {
          return { id: existing.id, uploadedBytes: existing.uploadedBytes }
        }

        const session: MemoryUploadSession = {
          id: `upload-${createId()}`,
          uploadedBytes: 0,
          request,
          chunks: [],
        }

        sessions.set(session.id, session)

        return { id: session.id, uploadedBytes: 0 }
      },

      async uploadChunk(request) {
        await begin('chunkedUpload.uploadChunk', request)

        const session = sessions.get(request.session.id)

        if (!session) {
          throw new FileManagerError('not-found', 'The upload session expired')
        }

        if (request.offset !== session.uploadedBytes) {
          throw new FileManagerError('invalid-operation', 'The chunk offset does not match')
        }

        session.chunks.push(request.chunk)
        session.uploadedBytes += request.chunk.size
        request.onProgress?.(request.chunk.size)
      },

      async complete(request) {
        await begin('chunkedUpload.complete', request)

        const session = sessions.get(request.session.id)

        if (!session) {
          throw new FileManagerError('not-found', 'The upload session expired')
        }

        const entry = writeFile(
          session.request,
          new Blob(session.chunks, { type: session.request.file.type }),
        )

        sessions.delete(session.id)

        return entry
      },

      async abort(request) {
        sessions.delete(request.session.id)
      },
    },

    async download(request) {
      await begin('download', request)

      const node = getNode(request.id)

      assertPermission(node.entry, 'download')

      if (node.entry.kind === 'folder') {
        throw new FileManagerError('invalid-operation', 'Folders are downloaded as an archive')
      }

      return { fileName: node.entry.name, blob: toBlob(node.content, node.entry.mimeType) }
    },

    async downloadMany(request) {
      await begin('downloadMany', request)

      const groups = await Promise.all(request.ids.map((id) => collectZipEntries(id, '')))

      return { fileName: 'download.zip', blob: createZipArchive(groups.flat()) }
    },

    async search(request) {
      await begin('search', request)

      const root = getFolder(request.folderId)
      const candidates = request.recursive
        ? getSubtree(root.entry.id).filter(
            (node) =>
              node.entry.id !== root.entry.id &&
              !node.entry.trashedAt &&
              !getAncestors(node.entry).some((ancestor) => ancestor.trashedAt),
          )
        : getChildren(root.entry.id)

      return paginate(
        candidates
          .map(toEntry)
          .filter(
            (entry) =>
              matchesQuery(entry, request.query) &&
              (!request.filters || matchesFilters(entry, request.filters)),
          ),
        request,
      )
    },

    async getPreview(request) {
      await begin('getPreview', request)

      const node = getNode(request.id)

      assertPermission(node.entry, 'read')

      if (node.url) {
        return { url: node.url, mimeType: node.entry.mimeType }
      }

      if (typeof node.content === 'string') {
        return { text: node.content, mimeType: node.entry.mimeType }
      }

      if (node.content) {
        return { blob: node.content, mimeType: node.entry.mimeType }
      }

      throw new FileManagerError('not-found', `${node.entry.name} has no preview`)
    },

    async getThumbnail(request) {
      await begin('getThumbnail', request)

      const node = getNode(request.id)

      if (getFileCategory(node.entry) !== 'image') {
        return null
      }

      return (
        node.entry.thumbnailUrl ?? node.url ?? (node.content instanceof Blob ? node.content : null)
      )
    },

    async setStarred(request) {
      await begin('setStarred', request)

      return runBulk(request.ids, (id, result) => {
        const node = getNode(id)

        node.entry = { ...node.entry, starred: request.starred }
        result.succeeded.push({ sourceId: id, entry: toEntry(node) })
      })
    },

    async listStarred(request) {
      await begin('listStarred', request)

      return paginate(
        [...nodes.values()]
          .filter((node) => node.entry.starred && !node.entry.trashedAt)
          .map(toEntry),
        request,
      )
    },

    async listRecent(request) {
      await begin('listRecent', request)

      const recent = [...nodes.values()]
        .filter((node) => node.entry.kind === 'file' && !node.entry.trashedAt)
        .map(toEntry)
        .sort((first, second) =>
          String(second.modifiedAt ?? '').localeCompare(String(first.modifiedAt ?? '')),
        )
        .slice(0, 50)

      return paginate(recent, request)
    },
  }
}
