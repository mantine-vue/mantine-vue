import type { VNodeChild } from 'vue'
import type { BoxProps, Factory, MantineColor, MantineRadius } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { FileManagerAction, FileManagerMenuItem } from '../../actions'
import type {
  FileManagerCacheOptions,
  FileManagerConfirmOptions,
  FileManagerController,
  FileManagerNotice,
  FileManagerPagination,
  FileManagerViewName,
} from '../../composables/use-file-manager'
import type { FileManagerFormatters } from '../../core/format'
import type {
  FileManagerFileIcons,
  FileManagerIconOverrides,
  FileManagerItemSize,
  FileManagerPreviewRenderer,
  FileManagerSections,
  FileManagerViewDefinition,
} from '../../FileManager.context'
import type { FileManagerLabelsOverride } from '../../labels'
import type {
  FileConflictStrategy,
  FileEntry,
  FileFilters,
  FileManagerLocation,
  FileSort,
  FileSystemAdapter,
  FileUploadRestrictions,
} from '../../types'

export type FileManagerStylesNames =
  | 'root'
  | 'portal'
  | 'dropzone'
  | 'dropOverlay'
  | 'toolbar'
  | 'toolbarStart'
  | 'toolbarActions'
  | 'toolbarEnd'
  | 'search'
  | 'breadcrumbs'
  | 'body'
  | 'sidebar'
  | 'sidebarSection'
  | 'sidebarLabel'
  | 'quickLink'
  | 'treeNode'
  | 'main'
  | 'scroller'
  | 'row'
  | 'item'
  | 'itemIcon'
  | 'itemName'
  | 'itemMeta'
  | 'itemControl'
  | 'table'
  | 'detailsPanel'
  | 'selectionBar'
  | 'statusBar'
  | 'pagination'
  | 'uploadPanel'
  | 'uploadItem'
  | 'notices'
  | 'previewBody'
  | 'previewText'
  | 'state'

type FileManagerCssVariable =
  | '--fm-accent'
  | '--fm-accent-light'
  | '--fm-folder-color'
  | '--fm-radius'
  | '--fm-row-height'

export type FileManagerCssVariables = {
  root: FileManagerCssVariable
  portal: FileManagerCssVariable
}

/** How the panes are arranged. `auto` measures the component rather than the viewport. */
export type FileManagerLayout = 'auto' | 'desktop' | 'compact'

export interface FileManagerSlots {
  /** Replaces the arrangement of the parts, for custom layouts. */
  layout?: (payload: { controller: FileManagerController; compact: boolean }) => VNodeChild

  /** Replaces how an entry is drawn in the grid, list and tree layouts. */
  item?: (payload: {
    entry: FileEntry
    selected: boolean
    active: boolean
    cut: boolean
    depth: number
  }) => VNodeChild

  /** Replaces the icon of an entry. */
  itemIcon?: (payload: { entry: FileEntry }) => VNodeChild

  /** Replaces the state shown when there is nothing to list. */
  empty?: (payload: { controller: FileManagerController }) => VNodeChild

  /** Replaces the loading state. */
  loading?: () => VNodeChild

  /** Replaces the error state. */
  error?: (payload: { controller: FileManagerController; retry: () => void }) => VNodeChild

  /** Rendered at the start of the toolbar. */
  toolbarStart?: (payload: { controller: FileManagerController }) => VNodeChild

  /** Rendered at the end of the toolbar. */
  toolbarEnd?: (payload: { controller: FileManagerController }) => VNodeChild

  /** Rendered below the folder tree. */
  sidebarFooter?: (payload: { controller: FileManagerController }) => VNodeChild

  /** Rendered at the end of the details of an entry. */
  details?: (payload: { entry: FileEntry }) => VNodeChild
}

export interface FileManagerEmits {
  'update:folderId': [folderId: string | null]
  'update:view': [view: FileManagerViewName]
  'update:sort': [sort: FileSort]
  'update:filters': [filters: FileFilters]
  'update:selectedIds': [ids: string[]]

  /** Emitted after the location changes. */
  locationChange: [location: FileManagerLocation]

  /** Emitted when a file is opened. */
  open: [entry: FileEntry]

  /** Emitted for every feedback message, including when `withNotices` is off. */
  notice: [notice: FileManagerNotice]
}

export interface FileManagerExposed {
  /** Headless controller of this instance. */
  controller: FileManagerController
}

export interface FileManagerOwnProps extends StylesApiProps<FileManagerFactory> {
  /** Connection to the backend. Required unless `controller` is passed. */
  adapter?: FileSystemAdapter

  /** Controller from `useFileManager`, to drive the manager from outside. */
  controller?: FileManagerController

  /** Controlled open folder, bound with `v-model:folder-id`. `null` is the root. */
  folderId?: string | null

  /** Folder opened first. */
  defaultFolderId?: string | null

  /** Controlled layout, bound with `v-model:view`. */
  view?: FileManagerViewName

  /**
   * Initial layout.
   *
   * @default 'details'
   */
  defaultView?: FileManagerViewName

  /** Controlled sort, bound with `v-model:sort`. */
  sort?: FileSort

  /** Initial sort. */
  defaultSort?: FileSort

  /** Controlled filters, bound with `v-model:filters`. */
  filters?: FileFilters

  /** Initial filters. */
  defaultFilters?: FileFilters

  /** Controlled selection, bound with `v-model:selected-ids`. */
  selectedIds?: string[]

  /** Initial selection. */
  defaultSelectedIds?: string[]

  /**
   * Arrangement of the panes.
   *
   * @default 'auto'
   */
  layout?: FileManagerLayout

  /**
   * Width in px below which `auto` switches to the compact layout.
   *
   * @default 620
   */
  compactBreakpoint?: number

  /**
   * Size preset of rows and cards.
   *
   * @default 'md'
   */
  itemSize?: FileManagerItemSize

  /** Key of `theme.colors` or any CSS color of selection and focus. Defaults to the primary color. */
  color?: MantineColor

  /** Key of `theme.colors` or any CSS color of folder icons. */
  folderColor?: MantineColor

  /** Key of `theme.radius` or any valid CSS value used by items and panels. */
  radius?: MantineRadius

  /** Sections to hide. Everything is shown by default, as far as the backend supports it. */
  sections?: FileManagerSections

  /** Layouts offered by the view switch: built-in names or custom definitions. */
  views?: (FileManagerViewName | FileManagerViewDefinition)[]

  /** Items of the toolbar: action ids, inline actions or `divider`. */
  toolbarActions?: FileManagerMenuItem[]

  /** Items of the menu of an entry. */
  itemMenu?: FileManagerMenuItem[]

  /** Items of the menu of the empty area. */
  backgroundMenu?: FileManagerMenuItem[]

  /** Items of the compact selection bar. */
  selectionActions?: FileManagerMenuItem[]

  /** Custom actions, referenced by id. An action with a built-in id replaces it. */
  actions?: FileManagerAction[]

  /** Last chance to change the items of any menu, per context. */
  resolveMenu?: (
    items: FileManagerAction[],
    context: import('../../actions').FileManagerActionContext,
  ) => FileManagerAction[]

  /** Keyboard shortcuts by action id, `false` turns them off. */
  shortcuts?: Record<string, string> | false

  /** Replaces interface icons. */
  icons?: FileManagerIconOverrides

  /** Replaces the icons of file categories. */
  fileIcons?: FileManagerFileIcons

  /** Renderers tried before the built-in previews. */
  previewRenderers?: FileManagerPreviewRenderer[]

  /** Replaces size and date formatting. */
  formatters?: Partial<FileManagerFormatters>

  /** Replaces any text. */
  labels?: FileManagerLabelsOverride

  /**
   * How long listings are split up.
   *
   * @default 'none'
   */
  pagination?: FileManagerPagination

  /**
   * Entries per page, also requested from the adapter.
   *
   * @default 100
   */
  pageSize?: number

  /**
   * Whether only the rows near the viewport are rendered.
   *
   * @default 'auto'
   */
  virtualize?: boolean | 'auto'

  /**
   * Entries from which `auto` virtualizes.
   *
   * @default 100
   */
  virtualizeThreshold?: number

  /** Listing cache, `false` to always fetch. */
  cache?: FileManagerCacheOptions | false

  /**
   * Whether folders are listed before files.
   *
   * @default true
   */
  foldersFirst?: boolean

  /** Fields offered by the sort control. */
  sortFields?: ('name' | 'size' | 'type' | 'modifiedAt')[]

  /** Additional predicate over the visible entries. */
  entryFilter?: (entry: FileEntry) => boolean

  /**
   * Whether search includes subfolders.
   *
   * @default true
   */
  recursiveSearch?: boolean

  /** Limits checked before files are uploaded. The backend must enforce them again. */
  restrictions?: FileUploadRestrictions

  /**
   * Parallel uploads.
   *
   * @default 3
   */
  uploadConcurrency?: number

  /** Chunk size of chunked uploads in bytes. */
  chunkSize?: number

  /**
   * How name collisions are settled.
   *
   * @default 'ask'
   */
  conflictStrategy?: FileConflictStrategy | 'ask'

  /**
   * Which destructive operations ask first. `true` asks for all.
   *
   * @default true
   */
  confirm?: FileManagerConfirmOptions | boolean

  /**
   * Whether entries can be dragged to folders.
   *
   * @default true
   */
  draggable?: boolean

  /** Opens entries with a single click, as on touch screens. */
  openOnSingleClick?: boolean

  /**
   * Whether feedback is shown inside the manager. Turn it off to route the `notice` event to
   * your own notification system.
   *
   * @default true
   */
  withNotices?: boolean
}

export interface FileManagerProps
  extends Omit<BoxProps, keyof FileManagerOwnProps>, FileManagerOwnProps {}

export type FileManagerFactory = Factory<{
  props: FileManagerProps
  ref: HTMLDivElement
  slots: FileManagerSlots
  element: 'div'
  stylesNames: FileManagerStylesNames
  vars: FileManagerCssVariables
  exposed: FileManagerExposed
}>
