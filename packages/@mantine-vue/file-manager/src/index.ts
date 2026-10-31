export * from './types'

export { FileManager } from './components/FileManager'
export type {
  FileManagerCssVariables,
  FileManagerEmits,
  FileManagerExposed,
  FileManagerFactory,
  FileManagerLayout,
  FileManagerOwnProps,
  FileManagerProps,
  FileManagerSlots,
  FileManagerStylesNames,
} from './components/FileManager'
export * from './components/parts'

export { useFileManager, saveFileToDevice } from './composables/use-file-manager'
export type {
  FileConfirmRequest,
  FileConflictRequest,
  FileManagerCacheOptions,
  FileManagerConfirmOptions,
  FileManagerController,
  FileManagerNotice,
  FileManagerPagination,
  FileManagerViewName,
  FileOperation,
  FileSelectionMode,
  UseFileManagerOptions,
} from './composables/use-file-manager'
export type {
  FileConflictDecision,
  FileUploadInput,
  FileUploadQueue,
} from './composables/use-upload-queue'
export { useVirtualRows } from './composables/use-virtual-rows'
export type { UseVirtualRowsOptions } from './composables/use-virtual-rows'

export { useFileManagerContext } from './FileManager.context'
export type {
  FileManagerConfig,
  FileManagerContextValue,
  FileManagerFileIcons,
  FileManagerIconOverrides,
  FileManagerItemSize,
  FileManagerPreviewRenderer,
  FileManagerSections,
  FileManagerViewDefinition,
  FileManagerViewItemProps,
} from './FileManager.context'

export {
  BUILT_IN_ACTIONS,
  DEFAULT_BACKGROUND_MENU,
  DEFAULT_ITEM_MENU,
  DEFAULT_SELECTION_BAR,
  DEFAULT_SHORTCUTS,
  DEFAULT_TOOLBAR_ACTIONS,
  DEFAULT_VIEWS,
} from './actions'
export type {
  FileManagerAction,
  FileManagerActionContext,
  FileManagerActionScope,
  FileManagerMenuItem,
  FileManagerUiActions,
} from './actions'

export { DEFAULT_FILE_MANAGER_LABELS, mergeFileManagerLabels } from './labels'
export type { FileManagerLabels, FileManagerLabelsOverride } from './labels'

export { createMemoryAdapter } from './adapters/create-memory-adapter'
export type {
  MemoryFileSeed,
  MemoryFileSystem,
  MemoryFileSystemOptions,
} from './adapters/create-memory-adapter'
export { createRestAdapter } from './adapters/create-rest-adapter'
export type { RestAdapterOptions } from './adapters/create-rest-adapter'
export { createZipArchive } from './adapters/zip'
export type { ZipEntry } from './adapters/zip'

export { resolveCapabilities, hasPermission, allHavePermission } from './core/capabilities'
export { FileManagerError, isAbortError, toFileErrorInfo } from './core/errors'
export {
  getFileCategory,
  getMimeType,
  isFileTypeAccepted,
  isSafePreviewUrl,
} from './core/file-types'
export { DEFAULT_FILE_MANAGER_FORMATTERS, formatFileDate, formatFileSize } from './core/format'
export type { FileManagerFormatters } from './core/format'
export {
  getAvailableName,
  getFileExtension,
  getFileNameIssue,
  isValidFileName,
  sanitizeRelativePath,
  splitFileName,
} from './core/paths'
export type { FileNameIssue } from './core/paths'
export {
  compareNames,
  countActiveFilters,
  matchesFilters,
  matchesQuery,
  sortEntries,
} from './core/sort-filter'

export { default as FileManagerIcon } from './icons/FileManagerIcon.vue'
export { FILE_MANAGER_ICON_PATHS } from './icons/icon-paths'
export type { FileManagerIconName } from './icons/icon-paths'
