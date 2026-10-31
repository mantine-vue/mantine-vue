import type { FileNameIssue } from './core/paths'
import type { FileCategory, FileErrorCode, FileSortField, FileUploadStatus } from './types'

/**
 * Every user-visible string the extension renders on its own.
 *
 * A consumer localizes the whole manager by passing one `labels` object, overriding only the
 * keys it needs.
 */
export interface FileManagerLabels {
  /* Regions */
  root: string
  toolbar: string
  sidebar: string
  content: string
  breadcrumbs: string
  statusBar: string
  folderTree: string

  /* Actions */
  open: string
  preview: string
  back: string
  forward: string
  up: string
  refresh: string
  newFolder: string
  upload: string
  uploadFiles: string
  uploadFolder: string
  download: string
  rename: string
  duplicate: string
  cut: string
  copy: string
  paste: string
  moveTo: string
  copyTo: string
  delete: string
  moveToTrash: string
  deletePermanently: string
  restore: string
  emptyTrash: string
  addToFavorites: string
  removeFromFavorites: string
  properties: string
  undo: string
  redo: string
  undoOperation: (operation: string) => string
  redoOperation: (operation: string) => string
  selectAll: string
  clearSelection: string
  toggleSidebar: string
  toggleDetails: string
  moreActions: string
  itemActions: (name: string) => string
  selectItem: (name: string) => string
  expandFolder: (name: string) => string
  collapseFolder: (name: string) => string

  /* Locations */
  home: string
  favorites: string
  recent: string
  trash: string
  quickAccess: string
  folders: string
  searchResults: string

  /* Search, sort and filter */
  search: string
  searchPlaceholder: string
  clearSearch: string
  searching: string
  sort: string
  sortBy: string
  sortFields: Record<FileSortField, string>
  sortAscending: string
  sortDescending: string
  foldersFirst: string
  filters: string
  fileType: string
  categories: Record<FileCategory, string>
  minSize: string
  maxSize: string
  sizeUnit: string
  modifiedAfter: string
  modifiedBefore: string
  starredOnly: string
  clearFilters: string
  view: string
  views: Record<string, string>

  /* Columns and details */
  name: string
  size: string
  type: string
  modified: string
  created: string
  location: string
  owner: string
  contents: string
  permissions: string
  originalLocation: string
  deletedAt: string
  folderKind: string
  noSelection: string
  details: string
  selectedSize: string
  readOnly: string
  fullAccess: string
  itemsCount: (count: number) => string
  selectedCount: (count: number) => string
  fileTypeName: (extension: string) => string

  /* Content states */
  loading: string
  loadingMore: string
  loadMore: string
  emptyFolder: string
  emptyFolderDescription: string
  emptySearch: string
  emptySearchDescription: string
  emptyFilters: string
  emptyFiltersDescription: string
  emptyFavorites: string
  emptyRecent: string
  emptyTrashState: string
  loadError: string
  retry: string
  goHome: string
  pagination: string

  /* Dialogs */
  cancel: string
  confirm: string
  close: string
  save: string
  create: string
  newFolderTitle: string
  newFolderName: string
  defaultFolderName: string
  renameTitle: (name: string) => string
  newName: string
  nameIssues: Record<FileNameIssue | 'exists', string>
  moveToTitle: (count: number) => string
  copyToTitle: (count: number) => string
  chooseFolder: string
  moveHere: string
  copyHere: string
  propertiesTitle: (name: string) => string
  deleteTitle: (count: number) => string
  deleteMessage: (names: string, count: number) => string
  trashTitle: (count: number) => string
  trashMessage: (names: string, count: number) => string
  emptyTrashTitle: string
  emptyTrashMessage: string
  conflictTitle: string
  conflictMessage: (name: string, folder: string) => string
  overwrite: string
  keepBoth: string
  skip: string
  applyToAll: string
  conflictRemaining: (count: number) => string

  /* Feedback */
  operationCompleted: (operation: string, count: number) => string
  operationPartiallyFailed: (operation: string, failed: number, total: number) => string
  operationFailed: (operation: string) => string
  moreFailures: (count: number) => string
  nothingToUndo: string
  clipboardCut: (count: number) => string
  clipboardCopied: (count: number) => string
  downloadFolderUnsupported: string
  errors: Record<FileErrorCode, string>

  /* Uploads */
  uploads: string
  uploadsSummary: (done: number, total: number) => string
  dropToUpload: string
  dropToUploadInto: (name: string) => string
  uploadStatus: Record<FileUploadStatus, string>
  cancelUpload: string
  retryUpload: string
  removeUpload: string
  cancelAllUploads: string
  retryFailedUploads: string
  clearFinishedUploads: string
  closeUploads: string
  fileTooLarge: (limit: string) => string
  fileTypeNotAllowed: string
  tooManyFiles: (limit: number) => string
  invalidFileName: string

  /* Preview */
  previewTitle: (name: string) => string
  previewUnavailable: string
  previewUnavailableDescription: string
  previewError: string
  previousFile: string
  nextFile: string
  previewPosition: (position: number, total: number) => string
  previewFrame: (name: string) => string
}

const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`

export const DEFAULT_FILE_MANAGER_LABELS: FileManagerLabels = {
  root: 'File manager',
  toolbar: 'File actions',
  sidebar: 'Navigation',
  content: 'Files',
  breadcrumbs: 'Current location',
  statusBar: 'Status',
  folderTree: 'Folders',

  open: 'Open',
  preview: 'Preview',
  back: 'Back',
  forward: 'Forward',
  up: 'Up one level',
  refresh: 'Refresh',
  newFolder: 'New folder',
  upload: 'Upload',
  uploadFiles: 'Upload files',
  uploadFolder: 'Upload folder',
  download: 'Download',
  rename: 'Rename',
  duplicate: 'Duplicate',
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  moveTo: 'Move to…',
  copyTo: 'Copy to…',
  delete: 'Delete',
  moveToTrash: 'Move to trash',
  deletePermanently: 'Delete permanently',
  restore: 'Restore',
  emptyTrash: 'Empty trash',
  addToFavorites: 'Add to favorites',
  removeFromFavorites: 'Remove from favorites',
  properties: 'Properties',
  undo: 'Undo',
  redo: 'Redo',
  undoOperation: (operation) => `Undo ${operation.toLowerCase()}`,
  redoOperation: (operation) => `Redo ${operation.toLowerCase()}`,
  selectAll: 'Select all',
  clearSelection: 'Clear selection',
  toggleSidebar: 'Toggle navigation',
  toggleDetails: 'Toggle details',
  moreActions: 'More actions',
  itemActions: (name) => `Actions for ${name}`,
  selectItem: (name) => `Select ${name}`,
  expandFolder: (name) => `Expand ${name}`,
  collapseFolder: (name) => `Collapse ${name}`,

  home: 'Home',
  favorites: 'Favorites',
  recent: 'Recent',
  trash: 'Trash',
  quickAccess: 'Quick access',
  folders: 'Folders',
  searchResults: 'Search results',

  search: 'Search',
  searchPlaceholder: 'Search files',
  clearSearch: 'Clear search',
  searching: 'Searching…',
  sort: 'Sort',
  sortBy: 'Sort by',
  sortFields: { name: 'Name', size: 'Size', type: 'Type', modifiedAt: 'Date modified' },
  sortAscending: 'Ascending',
  sortDescending: 'Descending',
  foldersFirst: 'Folders first',
  filters: 'Filters',
  fileType: 'File type',
  categories: {
    folder: 'Folders',
    image: 'Images',
    video: 'Videos',
    audio: 'Audio',
    pdf: 'PDF',
    document: 'Documents',
    spreadsheet: 'Spreadsheets',
    presentation: 'Presentations',
    archive: 'Archives',
    code: 'Code',
    text: 'Text',
    other: 'Other',
  },
  minSize: 'Minimum size',
  maxSize: 'Maximum size',
  sizeUnit: 'MB',
  modifiedAfter: 'Modified after',
  modifiedBefore: 'Modified before',
  starredOnly: 'Favorites only',
  clearFilters: 'Clear filters',
  view: 'View',
  views: {
    grid: 'Grid',
    list: 'List',
    details: 'Details',
    gallery: 'Gallery',
    tree: 'Tree',
  },

  name: 'Name',
  size: 'Size',
  type: 'Type',
  modified: 'Modified',
  created: 'Created',
  location: 'Location',
  owner: 'Owner',
  contents: 'Contents',
  permissions: 'Permissions',
  originalLocation: 'Original location',
  deletedAt: 'Deleted',
  folderKind: 'Folder',
  noSelection: 'Select an item to see its details',
  details: 'Details',
  selectedSize: 'Total size',
  readOnly: 'Read only',
  fullAccess: 'Full access',
  itemsCount: (count) => plural(count, 'item'),
  selectedCount: (count) => `${count} selected`,
  fileTypeName: (extension) => (extension ? `${extension.toUpperCase()} file` : 'File'),

  loading: 'Loading files…',
  loadingMore: 'Loading more…',
  loadMore: 'Load more',
  emptyFolder: 'This folder is empty',
  emptyFolderDescription: 'Upload files or create a folder to get started',
  emptySearch: 'No results',
  emptySearchDescription: 'Try a different search term',
  emptyFilters: 'Nothing matches the filters',
  emptyFiltersDescription: 'Change or clear the filters to see more files',
  emptyFavorites: 'No favorites yet',
  emptyRecent: 'No recent files',
  emptyTrashState: 'Trash is empty',
  loadError: 'This location could not be loaded',
  retry: 'Try again',
  goHome: 'Go to home',
  pagination: 'File pages',

  cancel: 'Cancel',
  confirm: 'Confirm',
  close: 'Close',
  save: 'Save',
  create: 'Create',
  newFolderTitle: 'New folder',
  newFolderName: 'Folder name',
  defaultFolderName: 'New folder',
  renameTitle: (name) => `Rename ${name}`,
  newName: 'New name',
  nameIssues: {
    empty: 'Enter a name',
    'too-long': 'The name is too long',
    'forbidden-character': 'The name contains characters that are not allowed',
    reserved: 'This name is reserved by the system',
    exists: 'An item with this name already exists',
  },
  moveToTitle: (count) => `Move ${plural(count, 'item')}`,
  copyToTitle: (count) => `Copy ${plural(count, 'item')}`,
  chooseFolder: 'Choose a destination folder',
  moveHere: 'Move here',
  copyHere: 'Copy here',
  propertiesTitle: (name) => `${name} properties`,
  deleteTitle: (count) => `Delete ${plural(count, 'item')} permanently?`,
  deleteMessage: (names) => `${names} will be permanently deleted. This cannot be undone.`,
  trashTitle: (count) => `Move ${plural(count, 'item')} to trash?`,
  trashMessage: (names) => `${names} can be restored from the trash.`,
  emptyTrashTitle: 'Empty trash?',
  emptyTrashMessage: 'Everything in the trash will be permanently deleted.',
  conflictTitle: 'Name conflict',
  conflictMessage: (name, folder) => `${folder} already contains an item named ${name}.`,
  overwrite: 'Replace',
  keepBoth: 'Keep both',
  skip: 'Skip',
  applyToAll: 'Do the same for the remaining conflicts',
  conflictRemaining: (count) => `${plural(count, 'more item')} left`,

  operationCompleted: (operation, count) => `${operation}: ${plural(count, 'item')}`,
  operationPartiallyFailed: (operation, failed, total) =>
    `${operation}: ${failed} of ${total} failed`,
  operationFailed: (operation) => `${operation} failed`,
  moreFailures: (count) => `and ${count} more`,
  nothingToUndo: 'Nothing to undo',
  clipboardCut: (count) => `${plural(count, 'item')} ready to move`,
  clipboardCopied: (count) => `${plural(count, 'item')} ready to copy`,
  downloadFolderUnsupported: 'This location cannot download folders',
  errors: {
    'not-found': 'The item no longer exists',
    'permission-denied': 'You do not have permission to do this',
    conflict: 'An item with this name already exists',
    'invalid-name': 'The name is not valid',
    'invalid-operation': 'This operation is not possible',
    'too-large': 'The file is too large',
    'type-not-allowed': 'This file type is not allowed',
    'quota-exceeded': 'There is not enough storage left',
    network: 'The server could not be reached. Check your connection and try again',
    aborted: 'The operation was canceled',
    unsupported: 'This operation is not supported',
    unknown: 'Something went wrong',
  },

  uploads: 'Uploads',
  uploadsSummary: (done, total) => `${done} of ${total} done`,
  dropToUpload: 'Drop files here to upload',
  dropToUploadInto: (name) => `Drop to upload to ${name}`,
  uploadStatus: {
    queued: 'Waiting',
    uploading: 'Uploading',
    success: 'Done',
    error: 'Failed',
    canceled: 'Canceled',
    skipped: 'Skipped',
    rejected: 'Not allowed',
  },
  cancelUpload: 'Cancel upload',
  retryUpload: 'Retry upload',
  removeUpload: 'Remove from list',
  cancelAllUploads: 'Cancel all',
  retryFailedUploads: 'Retry failed',
  clearFinishedUploads: 'Clear finished',
  closeUploads: 'Close uploads',
  fileTooLarge: (limit) => `The file is larger than the ${limit} limit`,
  fileTypeNotAllowed: 'This file type is not allowed',
  tooManyFiles: (limit) => `Only ${limit} files can be uploaded at once`,
  invalidFileName: 'The file name is not valid',

  previewTitle: (name) => `Preview of ${name}`,
  previewUnavailable: 'No preview available',
  previewUnavailableDescription: 'Download the file to open it',
  previewError: 'The preview could not be loaded',
  previousFile: 'Previous file',
  nextFile: 'Next file',
  previewPosition: (position, total) => `${position} of ${total}`,
  previewFrame: (name) => `PDF preview of ${name}`,
}

export type FileManagerLabelsOverride = Partial<FileManagerLabels>

/** Fills an override with the defaults. Nested groups are merged key by key. */
export function mergeFileManagerLabels(labels: FileManagerLabelsOverride | undefined) {
  const merged: FileManagerLabels = { ...DEFAULT_FILE_MANAGER_LABELS, ...labels }

  for (const key of [
    'sortFields',
    'categories',
    'views',
    'nameIssues',
    'errors',
    'uploadStatus',
  ] as const) {
    ;(merged as any)[key] = { ...DEFAULT_FILE_MANAGER_LABELS[key], ...labels?.[key] }
  }

  return merged
}
