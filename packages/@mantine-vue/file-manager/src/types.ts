/* Data model and backend contract of the file manager. Nothing here depends on Vue. */

export type FileEntryKind = 'file' | 'folder'

/** Any value `new Date()` accepts. */
export type FileTimestamp = string | number | Date

/** Value of a custom metadata field shown in the details panel. */
export type FileMetadataValue = string | number | boolean | null | undefined

/**
 * What the current user may do with an entry.
 *
 * Omitted fields mean "the backend did not restrict it". This only decides which controls the
 * interface offers. The backend remains responsible for enforcing every operation.
 */
export interface FileEntryPermissions {
  /** Open, preview and list. */
  read?: boolean

  /** Create items inside a folder, upload to it or overwrite a file. */
  write?: boolean

  rename?: boolean
  delete?: boolean
  move?: boolean
  copy?: boolean
  download?: boolean
}

export interface FileEntry {
  /** Stable identifier. Path-based backends can use the path, others an opaque id. */
  id: string

  /** Display name, including the extension. */
  name: string

  kind: FileEntryKind

  /** Id of the containing folder, `null` for the root. */
  parentId: string | null

  /** Human-readable location such as `/Documents/report.pdf`. */
  path?: string

  /** Size in bytes. */
  size?: number

  mimeType?: string
  createdAt?: FileTimestamp
  modifiedAt?: FileTimestamp

  /** Preview image url. Used before `adapter.getThumbnail`. */
  thumbnailUrl?: string

  /** Whether a folder may contain subfolders. Leave undefined when unknown. */
  hasChildren?: boolean

  /** Number of direct children of a folder. */
  childCount?: number

  /** Whether the entry is in the user's favorites. */
  starred?: boolean

  /** Display name of the owner. */
  owner?: string

  /** When the entry was moved to the trash. */
  trashedAt?: FileTimestamp

  /** Where a trashed entry came from. */
  originalPath?: string

  permissions?: FileEntryPermissions

  /** Custom fields shown in the details panel. */
  metadata?: Record<string, FileMetadataValue>
}

export type FileSortField = 'name' | 'size' | 'type' | 'modifiedAt'
export type FileSortDirection = 'asc' | 'desc'

export interface FileSort {
  field: FileSortField
  direction: FileSortDirection
}

/** Built-in file categories, used by icons, filters and the `type` sort. */
export type FileCategory =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'archive'
  | 'code'
  | 'text'
  | 'other'

/** Criteria applied on top of the loaded entries. */
export interface FileFilters {
  /** Only entries of these categories. Empty means all. */
  categories?: FileCategory[]

  /** Minimum size in bytes. */
  minSize?: number

  /** Maximum size in bytes. */
  maxSize?: number

  /** Only entries modified at or after this instant. */
  modifiedAfter?: FileTimestamp

  /** Only entries modified at or before this instant. */
  modifiedBefore?: FileTimestamp

  /** Only entries that are starred. */
  starredOnly?: boolean
}

/** How a name collision is settled. `fail` reports it back as a `conflict` error. */
export type FileConflictStrategy = 'fail' | 'overwrite' | 'rename' | 'skip'

export type FileErrorCode =
  | 'not-found'
  | 'permission-denied'
  | 'conflict'
  | 'invalid-name'
  | 'invalid-operation'
  | 'too-large'
  | 'type-not-allowed'
  | 'quota-exceeded'
  | 'network'
  | 'aborted'
  | 'unsupported'
  | 'unknown'

/** Serializable shape of an error, as reported per item by bulk operations. */
export interface FileErrorInfo {
  code: FileErrorCode
  message: string

  /** Entry that already holds the name, for `conflict` errors. */
  conflictWith?: FileEntry
}

export interface FileBulkSuccess {
  /** Id the operation was asked to process. */
  sourceId: string

  /** Resulting entry. Omit it when the entry no longer exists, as after a delete. */
  entry?: FileEntry
}

export interface FileBulkFailure {
  id: string
  name?: string
  error: FileErrorInfo
}

/**
 * Outcome of an operation over several entries.
 *
 * Adapters report per-item results rather than rejecting, so one bad item does not hide the
 * items that already went through.
 */
export interface FileBulkResult {
  succeeded: FileBulkSuccess[]
  failed: FileBulkFailure[]

  /** Ids left untouched because of the `skip` conflict strategy. */
  skipped?: string[]
}

export interface FileRequestBase {
  /** Aborted when the result is no longer needed. Adapters should forward it to their requests. */
  signal?: AbortSignal
}

export interface FilePageRequest extends FileRequestBase {
  /** Value of `nextCursor` from the previous page. */
  cursor?: string

  /** Requested page size. Adapters may return fewer items. */
  limit?: number

  /** Only passed when the adapter declares `serverSort`. */
  sort?: FileSort
}

export interface FileListRequest extends FilePageRequest {
  /** Folder to list, `null` for the root. */
  folderId: string | null

  /** Hint that only folders are needed, used by the folder tree. May be ignored. */
  foldersOnly?: boolean
}

export interface FilePageResult {
  items: FileEntry[]

  /** Cursor of the next page, empty when this was the last one. */
  nextCursor?: string | null

  /** Total number of items across every page, when known. */
  total?: number
}

export interface FileListResult extends FilePageResult {
  /** The listed folder itself. */
  folder: FileEntry

  /** Ancestors of the folder from the root down, excluding the folder. */
  ancestors: FileEntry[]
}

export interface FileSearchRequest extends FilePageRequest {
  query: string

  /** Folder to search in, `null` for the root. */
  folderId: string | null

  /** Whether subfolders are searched. */
  recursive: boolean

  /** Active filters, for adapters that apply them on the server. */
  filters?: FileFilters
}

export interface FileCreateFolderRequest extends FileRequestBase {
  parentId: string | null
  name: string
}

export interface FileRenameRequest extends FileRequestBase {
  id: string
  name: string
}

export interface FileTransferRequest extends FileRequestBase {
  ids: string[]

  /** Destination folder, `null` for the root. */
  targetId: string | null

  conflict: FileConflictStrategy
}

export interface FileIdsRequest extends FileRequestBase {
  ids: string[]
}

export interface FileIdRequest extends FileRequestBase {
  id: string
}

export interface FileStarRequest extends FileIdsRequest {
  starred: boolean
}

export interface FileThumbnailRequest extends FileIdRequest {
  width: number
  height: number
}

export interface FileUploadRequest extends FileRequestBase {
  /** Destination folder, `null` for the root. */
  parentId: string | null

  file: File

  /**
   * Sanitized path relative to `parentId` for folder uploads, for example `photos/2026/a.jpg`.
   * The adapter creates the intermediate folders.
   */
  relativePath?: string

  conflict: FileConflictStrategy

  /** Reports the number of bytes transferred so far. */
  onProgress?: (loaded: number, total: number) => void
}

/** A chunked upload in progress. */
export interface FileUploadSession {
  id: string

  /** Bytes the backend already holds, which lets a retry resume where it stopped. */
  uploadedBytes: number
}

export interface FileUploadChunkRequest extends FileRequestBase {
  session: FileUploadSession
  chunk: Blob

  /** Offset of the chunk within the file. */
  offset: number

  /** Reports the bytes of this chunk transferred so far. */
  onProgress?: (loaded: number) => void
}

/** Optional protocol for large files. Used for files larger than `chunkSize`. */
export interface FileChunkedUploadAdapter {
  /** Starts a session, or returns the existing one when `resumeId` is still valid. */
  start: (
    request: FileUploadRequest & { resumeId?: string; chunkSize: number },
  ) => Promise<FileUploadSession>
  uploadChunk: (request: FileUploadChunkRequest) => Promise<void>
  complete: (request: FileRequestBase & { session: FileUploadSession }) => Promise<FileEntry>
  abort: (request: { session: FileUploadSession }) => Promise<void>
}

/** A file to hand to the browser. */
export type FileDownloadResult = { fileName: string } & (
  | { url: string; blob?: undefined }
  | { blob: Blob; url?: undefined }
)

/** Content used to preview a file. */
export interface FilePreviewSource {
  /** `http(s):` or `blob:` url. Other protocols are refused. */
  url?: string

  /** Binary content. Converted to an object url that is revoked when the preview closes. */
  blob?: Blob

  /** Text content, rendered as plain text and never as markup. */
  text?: string

  /** Overrides the type of the entry. */
  mimeType?: string
}

/**
 * Operations the backend supports, resolved from the methods of the adapter and its overrides.
 * The interface hides or disables anything that is `false`.
 */
export interface FileSystemCapabilities {
  createFolder: boolean
  rename: boolean
  move: boolean
  copy: boolean
  delete: boolean
  trash: boolean
  restore: boolean
  emptyTrash: boolean
  upload: boolean
  folderUpload: boolean
  chunkedUpload: boolean
  download: boolean
  downloadMany: boolean
  search: boolean
  preview: boolean
  thumbnails: boolean
  favorites: boolean
  recent: boolean
  serverSort: boolean
}

/**
 * Connects the file manager to a backend.
 *
 * Only `list` is required. Every other method is optional, and leaving one out removes the
 * matching feature from the interface. Methods should reject with a `FileManagerError`, or any
 * error, which is then normalized.
 */
export interface FileSystemAdapter {
  /** Overrides detected capabilities, typically to turn something off for the current user. */
  capabilities?: Partial<FileSystemCapabilities>

  list: (request: FileListRequest) => Promise<FileListResult>
  get?: (request: FileIdRequest) => Promise<FileEntry>
  createFolder?: (request: FileCreateFolderRequest) => Promise<FileEntry>
  rename?: (request: FileRenameRequest) => Promise<FileEntry>
  move?: (request: FileTransferRequest) => Promise<FileBulkResult>
  copy?: (request: FileTransferRequest) => Promise<FileBulkResult>

  /** Removes entries permanently. */
  delete?: (request: FileIdsRequest) => Promise<FileBulkResult>

  /** Moves entries to the trash. */
  trash?: (request: FileIdsRequest) => Promise<FileBulkResult>
  restore?: (request: FileIdsRequest) => Promise<FileBulkResult>
  listTrash?: (request: FilePageRequest) => Promise<FilePageResult>
  emptyTrash?: (request: FileRequestBase) => Promise<void>

  upload?: (request: FileUploadRequest) => Promise<FileEntry>
  chunkedUpload?: FileChunkedUploadAdapter

  download?: (request: FileIdRequest) => Promise<FileDownloadResult>

  /** Returns one archive with every requested entry, folders included. */
  downloadMany?: (request: FileIdsRequest) => Promise<FileDownloadResult>

  search?: (request: FileSearchRequest) => Promise<FilePageResult>
  getPreview?: (request: FileIdRequest) => Promise<FilePreviewSource>

  /** Returns a thumbnail url, or `null` when the entry has none. */
  getThumbnail?: (request: FileThumbnailRequest) => Promise<string | Blob | null>

  setStarred?: (request: FileStarRequest) => Promise<FileBulkResult>
  listStarred?: (request: FilePageRequest) => Promise<FilePageResult>
  listRecent?: (request: FilePageRequest) => Promise<FilePageResult>
}

/** Where the manager is pointed: a folder, or a virtual collection provided by the adapter. */
export type FileManagerLocation =
  | { type: 'folder'; id: string | null }
  | { type: 'favorites' }
  | { type: 'recent' }
  | { type: 'trash' }

/** Limits checked before a file is queued. The backend must enforce them again. */
export interface FileUploadRestrictions {
  /** Largest accepted file in bytes. */
  maxFileSize?: number

  /** Accepted types: mime types (`image/png`), wildcards (`image/*`) or extensions (`.pdf`). */
  accept?: string[]

  /** Most files accepted in one upload. */
  maxFiles?: number
}

export type FileUploadStatus =
  | 'queued'
  | 'uploading'
  | 'success'
  | 'error'
  | 'canceled'
  | 'skipped'
  | 'rejected'

export interface FileUploadItem {
  id: string
  file: File
  name: string
  size: number
  parentId: string | null
  relativePath?: string
  status: FileUploadStatus

  /** Transferred bytes. */
  loaded: number

  /** Completion from 0 to 100. */
  progress: number

  error?: FileErrorInfo

  /** Resulting entry once the upload succeeded. */
  entry?: FileEntry

  /** Chunked session kept between retries so the upload can resume. */
  session?: FileUploadSession

  /** Conflict strategy used for the next attempt. */
  conflict?: FileConflictStrategy
}
