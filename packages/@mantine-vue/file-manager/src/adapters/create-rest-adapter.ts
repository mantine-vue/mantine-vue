import { FileManagerError } from '../core/errors'
import type {
  FileBulkResult,
  FileDownloadResult,
  FileEntry,
  FileErrorCode,
  FileListResult,
  FilePageRequest,
  FilePageResult,
  FileSystemAdapter,
  FileSystemCapabilities,
  FileUploadRequest,
} from '../types'

export interface RestAdapterOptions {
  /** Base url of the API, without a trailing slash. */
  baseUrl: string

  /** Custom fetch, for example one that refreshes tokens. @default globalThis.fetch */
  fetch?: typeof fetch

  /** Headers of every request. A function is evaluated per request. */
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>)

  /** Credentials mode of every request. */
  credentials?: RequestCredentials

  /** Maps a raw API entry to a `FileEntry`, when the API does not use that shape. */
  mapEntry?: (raw: any) => FileEntry

  /** Turns off endpoints the API does not implement. */
  capabilities?: Partial<FileSystemCapabilities>
}

const STATUS_CODES: Record<number, FileErrorCode> = {
  401: 'permission-denied',
  403: 'permission-denied',
  404: 'not-found',
  409: 'conflict',
  413: 'too-large',
  415: 'type-not-allowed',
  422: 'invalid-name',
  507: 'quota-exceeded',
}

function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.set(key, String(value))
    }
  })

  const query = search.toString()

  return query ? `?${query}` : ''
}

function pageParams(request: FilePageRequest) {
  return {
    cursor: request.cursor,
    limit: request.limit,
    sort: request.sort?.field,
    direction: request.sort?.direction,
  }
}

/** Builds the error of a failed response from its status and `{ message, code }` body. */
function toError(status: number, body: any) {
  const code: FileErrorCode = body?.code ?? STATUS_CODES[status] ?? 'unknown'

  return new FileManagerError(code, body?.message ?? `Request failed with status ${status}`, {
    status,
    conflictWith: body?.conflictWith,
  })
}

function parseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * Adapter for an HTTP API that follows the convention described in the documentation.
 *
 * Every path segment that comes from data is encoded, so an id can never change the endpoint
 * being called.
 */
export function createRestAdapter(options: RestAdapterOptions): FileSystemAdapter {
  const { baseUrl, credentials, mapEntry = (raw: any) => raw as FileEntry } = options
  const send = (input: string, init: RequestInit) =>
    (options.fetch ?? globalThis.fetch)(input, init)

  const resolveHeaders = async () =>
    new Headers(
      typeof options.headers === 'function' ? await options.headers() : (options.headers ?? {}),
    )

  async function request(path: string, init: RequestInit = {}) {
    const headers = await resolveHeaders()

    if (init.body && typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json')
    }

    const response = await send(`${baseUrl}${path}`, { ...init, headers, credentials })

    if (!response.ok) {
      throw toError(response.status, parseJson(await response.text()))
    }

    return response
  }

  const getJson = async (path: string, signal?: AbortSignal) =>
    (await request(path, { signal })).json()

  const postJson = async (path: string, body: unknown, signal?: AbortSignal) =>
    (await request(path, { method: 'POST', body: JSON.stringify(body), signal })).json()

  const mapPage = (result: any): FilePageResult => ({
    ...result,
    items: result.items.map(mapEntry),
  })

  const mapList = (result: any): FileListResult => ({
    ...mapPage(result),
    folder: mapEntry(result.folder),
    ancestors: result.ancestors.map(mapEntry),
  })

  const mapBulk = (result: any): FileBulkResult => ({
    ...result,
    succeeded: result.succeeded.map((item: any) => ({
      ...item,
      entry: item.entry ? mapEntry(item.entry) : undefined,
    })),
  })

  const item = (id: string) => `/items/${encodeURIComponent(id)}`

  async function downloadBlob(path: string, fileName: string, init: RequestInit = {}) {
    const response = await request(path, init)
    const disposition = response.headers.get('Content-Disposition') ?? ''
    const match = /filename\*?="?(?:UTF-8'')?([^";]+)"?/i.exec(disposition)

    return {
      fileName: match ? decodeURIComponent(match[1]) : fileName,
      blob: await response.blob(),
    } satisfies FileDownloadResult
  }

  /** `fetch` cannot report upload progress, so uploads go through `XMLHttpRequest`. */
  async function upload(input: FileUploadRequest) {
    const headers = await resolveHeaders()
    const body = new FormData()

    body.append('file', input.file)
    body.append('conflict', input.conflict)

    if (input.parentId !== null) {
      body.append('parentId', input.parentId)
    }

    if (input.relativePath) {
      body.append('relativePath', input.relativePath)
    }

    return new Promise<FileEntry>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const onAbort = () => xhr.abort()
      const cleanup = () => input.signal?.removeEventListener('abort', onAbort)

      xhr.open('POST', `${baseUrl}/files`)
      xhr.withCredentials = credentials === 'include'
      headers.forEach((value, key) => xhr.setRequestHeader(key, value))

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          input.onProgress?.(event.loaded, event.total)
        }
      }

      xhr.onload = () => {
        cleanup()

        const parsed = parseJson(xhr.responseText)

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(mapEntry(parsed))
        } else {
          reject(toError(xhr.status, parsed))
        }
      }

      xhr.onerror = () => {
        cleanup()
        reject(new FileManagerError('network', 'The upload could not reach the server'))
      }

      xhr.onabort = () => {
        cleanup()
        reject(new FileManagerError('aborted', 'The upload was canceled'))
      }

      input.signal?.addEventListener('abort', onAbort, { once: true })
      xhr.send(body)
    })
  }

  return {
    capabilities: { folderUpload: true, serverSort: true, ...options.capabilities },

    list: async (input) =>
      mapList(
        await getJson(
          `/folders/${encodeURIComponent(input.folderId ?? 'root')}/children${toQuery({
            ...pageParams(input),
            foldersOnly: input.foldersOnly || undefined,
          })}`,
          input.signal,
        ),
      ),

    get: async (input) => mapEntry(await getJson(item(input.id), input.signal)),

    createFolder: async ({ parentId, name, signal }) =>
      mapEntry(await postJson('/folders', { parentId, name }, signal)),

    rename: async ({ id, name, signal }) =>
      mapEntry(
        await (
          await request(item(id), { method: 'PATCH', body: JSON.stringify({ name }), signal })
        ).json(),
      ),

    move: async ({ signal, ...body }) => mapBulk(await postJson('/items/move', body, signal)),
    copy: async ({ signal, ...body }) => mapBulk(await postJson('/items/copy', body, signal)),
    delete: async ({ signal, ...body }) => mapBulk(await postJson('/items/delete', body, signal)),
    trash: async ({ signal, ...body }) => mapBulk(await postJson('/items/trash', body, signal)),
    restore: async ({ signal, ...body }) => mapBulk(await postJson('/items/restore', body, signal)),

    listTrash: async (input) =>
      mapPage(await getJson(`/trash${toQuery(pageParams(input))}`, input.signal)),

    emptyTrash: async ({ signal }) => {
      await request('/trash', { method: 'DELETE', signal })
    },

    upload,

    download: ({ id, signal }) => downloadBlob(`${item(id)}/content`, 'download', { signal }),

    downloadMany: ({ ids, signal }) =>
      downloadBlob('/items/archive', 'download.zip', {
        method: 'POST',
        body: JSON.stringify({ ids }),
        signal,
      }),

    search: async ({ query, folderId, recursive, signal, ...page }) =>
      mapPage(
        await getJson(
          `/search${toQuery({
            query,
            folderId: folderId ?? undefined,
            recursive,
            ...pageParams(page),
          })}`,
          signal,
        ),
      ),

    getPreview: async ({ id, signal }) => {
      const response = await request(`${item(id)}/content`, { signal })
      const blob = await response.blob()

      return { blob, mimeType: blob.type }
    },

    getThumbnail: async ({ id, width, height, signal }) => {
      try {
        const response = await request(`${item(id)}/thumbnail${toQuery({ width, height })}`, {
          signal,
        })

        return await response.blob()
      } catch (error) {
        if (error instanceof FileManagerError && error.code === 'not-found') {
          return null
        }

        throw error
      }
    },

    setStarred: async ({ signal, ...body }) => mapBulk(await postJson('/items/star', body, signal)),

    listStarred: async (input) =>
      mapPage(await getJson(`/starred${toQuery(pageParams(input))}`, input.signal)),

    listRecent: async (input) =>
      mapPage(await getJson(`/recent${toQuery(pageParams(input))}`, input.signal)),
  }
}
