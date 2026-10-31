import type { Component } from 'vue'
import type { FileManagerController, FileManagerViewName } from './composables/use-file-manager'
import { allHavePermission, hasPermission } from './core/capabilities'
import type { FileManagerIconName } from './icons/icon-paths'
import type { FileManagerLabels } from './labels'
import type { FileEntry } from './types'

/** Interface operations an action can trigger, on top of the controller. */
export interface FileManagerUiActions {
  openNewFolder: () => void
  openRename: (entry: FileEntry) => void
  openTransfer: (mode: 'move' | 'copy', entries: FileEntry[]) => void
  openProperties: (entry: FileEntry) => void
  openFilePicker: () => void
  openFolderPicker: () => void
}

/** Where a menu was opened from. */
export type FileManagerActionScope = 'toolbar' | 'item' | 'background' | 'selection'

export interface FileManagerActionContext {
  controller: FileManagerController
  labels: FileManagerLabels
  ui: FileManagerUiActions

  /** Entries the action applies to. */
  entries: FileEntry[]

  scope: FileManagerActionScope
}

/** One operation of the toolbar, the context menus or the keyboard. */
export interface FileManagerAction {
  id: string
  label: string | ((context: FileManagerActionContext) => string)

  /** Name of a built-in icon, or any component. */
  icon?: FileManagerIconName | Component

  /** Key of `theme.colors`, used for destructive actions. */
  color?: string

  /** Keyboard hint shown next to the label. */
  shortcutLabel?: string

  /** Whether the action is offered at all. Defaults to always. */
  visible?: (context: FileManagerActionContext) => boolean

  /** Whether the action can run right now. Defaults to always. */
  enabled?: (context: FileManagerActionContext) => boolean

  run: (context: FileManagerActionContext) => void | Promise<unknown>
}

/** An action id, an inline action, or `divider`. */
export type FileManagerMenuItem = string | FileManagerAction

export const DEFAULT_TOOLBAR_ACTIONS: FileManagerMenuItem[] = [
  'newFolder',
  'upload',
  'uploadFolder',
  'divider',
  'cut',
  'copy',
  'paste',
  'divider',
  'rename',
  'download',
  'delete',
  'restore',
  'emptyTrash',
  'divider',
  'undo',
  'redo',
]

export const DEFAULT_ITEM_MENU: FileManagerMenuItem[] = [
  'open',
  'preview',
  'divider',
  'cut',
  'copy',
  'duplicate',
  'divider',
  'rename',
  'moveTo',
  'copyTo',
  'divider',
  'favorite',
  'download',
  'divider',
  'restore',
  'delete',
  'deletePermanently',
  'divider',
  'properties',
]

export const DEFAULT_BACKGROUND_MENU: FileManagerMenuItem[] = [
  'newFolder',
  'uploadFiles',
  'uploadFolder',
  'divider',
  'paste',
  'divider',
  'selectAll',
  'refresh',
  'emptyTrash',
]

export const DEFAULT_SELECTION_BAR: FileManagerMenuItem[] = [
  'download',
  'moveTo',
  'delete',
  'restore',
]

const can = (context: FileManagerActionContext) => context.controller.capabilities.value
const hasEntries = ({ entries }: FileManagerActionContext) => entries.length > 0
const isSingle = ({ entries }: FileManagerActionContext) => entries.length === 1
const inTrash = ({ controller }: FileManagerActionContext) => controller.inTrash.value
const notInTrash = (context: FileManagerActionContext) => !inTrash(context)
const writable = ({ controller }: FileManagerActionContext) => controller.canWriteHere.value

/** Every built-in action. Visibility follows the capabilities of the adapter. */
export const BUILT_IN_ACTIONS: FileManagerAction[] = [
  {
    id: 'open',
    label: ({ labels }) => labels.open,
    icon: 'folder',
    visible: (context) => notInTrash(context) && isSingle(context),
    run: ({ controller, entries }) => controller.open(entries[0]),
  },
  {
    id: 'preview',
    label: ({ labels }) => labels.preview,
    icon: 'eye',
    visible: (context) =>
      notInTrash(context) &&
      can(context).preview &&
      isSingle(context) &&
      context.entries[0].kind === 'file',
    enabled: ({ entries }) => hasPermission(entries[0], 'read'),
    run: ({ controller, entries }) => {
      controller.previewEntry.value = entries[0]
    },
  },
  {
    id: 'back',
    label: ({ labels }) => labels.back,
    icon: 'arrowLeft',
    enabled: ({ controller }) => controller.canGoBack.value,
    run: ({ controller }) => controller.goBack(),
  },
  {
    id: 'forward',
    label: ({ labels }) => labels.forward,
    icon: 'arrowRight',
    enabled: ({ controller }) => controller.canGoForward.value,
    run: ({ controller }) => controller.goForward(),
  },
  {
    id: 'up',
    label: ({ labels }) => labels.up,
    icon: 'arrowUp',
    enabled: ({ controller }) => controller.canGoUp.value,
    run: ({ controller }) => controller.goUp(),
  },
  {
    id: 'refresh',
    label: ({ labels }) => labels.refresh,
    icon: 'refresh',
    run: ({ controller }) => controller.refresh(),
  },
  {
    id: 'newFolder',
    label: ({ labels }) => labels.newFolder,
    icon: 'folderPlus',
    visible: (context) => can(context).createFolder && context.controller.inFolder.value,
    enabled: writable,
    run: ({ ui }) => ui.openNewFolder(),
  },
  {
    id: 'upload',
    label: ({ labels }) => labels.upload,
    icon: 'upload',
    visible: (context) => can(context).upload && context.controller.inFolder.value,
    enabled: writable,
    run: ({ ui }) => ui.openFilePicker(),
  },
  {
    id: 'uploadFiles',
    label: ({ labels }) => labels.uploadFiles,
    icon: 'upload',
    visible: (context) => can(context).upload && context.controller.inFolder.value,
    enabled: writable,
    run: ({ ui }) => ui.openFilePicker(),
  },
  {
    id: 'uploadFolder',
    label: ({ labels }) => labels.uploadFolder,
    icon: 'folderMove',
    visible: (context) => can(context).folderUpload && context.controller.inFolder.value,
    enabled: writable,
    run: ({ ui }) => ui.openFolderPicker(),
  },
  {
    id: 'download',
    label: ({ labels }) => labels.download,
    icon: 'download',
    visible: (context) =>
      notInTrash(context) && (can(context).download || can(context).downloadMany),
    enabled: (context) =>
      hasEntries(context) &&
      allHavePermission(context.entries, 'download') &&
      (can(context).downloadMany ||
        (can(context).download && context.entries.some((entry) => entry.kind === 'file'))),
    run: ({ controller, entries }) => controller.download(entries),
  },
  {
    id: 'rename',
    label: ({ labels }) => labels.rename,
    icon: 'pencil',
    shortcutLabel: 'F2',
    visible: (context) => notInTrash(context) && can(context).rename,
    enabled: (context) => isSingle(context) && hasPermission(context.entries[0], 'rename'),
    run: ({ ui, entries }) => ui.openRename(entries[0]),
  },
  {
    id: 'duplicate',
    label: ({ labels }) => labels.duplicate,
    icon: 'copy',
    visible: (context) => notInTrash(context) && can(context).copy,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'copy'),
    run: ({ controller, entries }) => controller.duplicate(entries),
  },
  {
    id: 'cut',
    label: ({ labels }) => labels.cut,
    icon: 'cut',
    shortcutLabel: 'Ctrl+X',
    visible: (context) => notInTrash(context) && can(context).move,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'move'),
    run: ({ controller, entries }) => controller.cut(entries),
  },
  {
    id: 'copy',
    label: ({ labels }) => labels.copy,
    icon: 'copy',
    shortcutLabel: 'Ctrl+C',
    visible: (context) => notInTrash(context) && can(context).copy,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'copy'),
    run: ({ controller, entries }) => controller.copyToClipboard(entries),
  },
  {
    id: 'paste',
    label: ({ labels }) => labels.paste,
    icon: 'paste',
    shortcutLabel: 'Ctrl+V',
    visible: (context) =>
      notInTrash(context) &&
      (can(context).move || can(context).copy) &&
      context.controller.inFolder.value,
    enabled: (context) => !!context.controller.clipboard.value && writable(context),
    run: ({ controller }) => controller.paste(),
  },
  {
    id: 'moveTo',
    label: ({ labels }) => labels.moveTo,
    icon: 'folderMove',
    visible: (context) => notInTrash(context) && can(context).move,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'move'),
    run: ({ ui, entries }) => ui.openTransfer('move', entries),
  },
  {
    id: 'copyTo',
    label: ({ labels }) => labels.copyTo,
    icon: 'copy',
    visible: (context) => notInTrash(context) && can(context).copy,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'copy'),
    run: ({ ui, entries }) => ui.openTransfer('copy', entries),
  },
  {
    id: 'favorite',
    label: ({ labels, entries }) =>
      entries.every((entry) => entry.starred) ? labels.removeFromFavorites : labels.addToFavorites,
    icon: 'star',
    visible: (context) => notInTrash(context) && can(context).favorites && hasEntries(context),
    run: ({ controller, entries }) =>
      controller.setStarred(entries, !entries.every((entry) => entry.starred)),
  },
  {
    id: 'delete',
    label: ({ labels, controller }) =>
      controller.capabilities.value.trash ? labels.moveToTrash : labels.delete,
    icon: 'trash',
    color: 'red',
    shortcutLabel: 'Del',
    visible: (context) => notInTrash(context) && (can(context).trash || can(context).delete),
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'delete'),
    run: ({ controller, entries }) => {
      void controller.remove(entries)
    },
  },
  {
    id: 'deletePermanently',
    label: ({ labels }) => labels.deletePermanently,
    icon: 'trashX',
    color: 'red',
    visible: (context) => inTrash(context) && can(context).delete,
    enabled: (context) => hasEntries(context) && allHavePermission(context.entries, 'delete'),
    run: ({ controller, entries }) => {
      void controller.deletePermanently(entries)
    },
  },
  {
    id: 'restore',
    label: ({ labels }) => labels.restore,
    icon: 'restore',
    visible: (context) => inTrash(context) && can(context).restore,
    enabled: hasEntries,
    run: ({ controller, entries }) => {
      void controller.restore(entries)
    },
  },
  {
    id: 'emptyTrash',
    label: ({ labels }) => labels.emptyTrash,
    icon: 'trashX',
    color: 'red',
    visible: (context) => inTrash(context) && can(context).emptyTrash,
    enabled: ({ controller }) => controller.items.value.length > 0,
    run: ({ controller }) => controller.emptyTrash(),
  },
  {
    id: 'properties',
    label: ({ labels }) => labels.properties,
    icon: 'info',
    visible: isSingle,
    run: ({ ui, entries }) => ui.openProperties(entries[0]),
  },
  {
    id: 'undo',
    label: ({ labels, controller }) =>
      controller.undoLabel.value ? labels.undoOperation(controller.undoLabel.value) : labels.undo,
    icon: 'undo',
    shortcutLabel: 'Ctrl+Z',
    enabled: ({ controller }) => controller.canUndo.value,
    run: ({ controller }) => controller.undo(),
  },
  {
    id: 'redo',
    label: ({ labels, controller }) =>
      controller.redoLabel.value ? labels.redoOperation(controller.redoLabel.value) : labels.redo,
    icon: 'redo',
    shortcutLabel: 'Ctrl+Y',
    enabled: ({ controller }) => controller.canRedo.value,
    run: ({ controller }) => controller.redo(),
  },
  {
    id: 'selectAll',
    label: ({ labels }) => labels.selectAll,
    icon: 'selectAll',
    shortcutLabel: 'Ctrl+A',
    run: ({ controller }) => controller.selectAll(),
  },
  {
    id: 'clearSelection',
    label: ({ labels }) => labels.clearSelection,
    icon: 'x',
    run: ({ controller }) => controller.clearSelection(),
  },
]

/** Default keyboard shortcuts by action id. Syntax of `use-hotkeys`. */
export const DEFAULT_SHORTCUTS: Record<string, string> = {
  selectAll: 'mod+A',
  cut: 'mod+X',
  copy: 'mod+C',
  paste: 'mod+V',
  undo: 'mod+Z',
  redo: 'mod+Y',
  duplicate: 'mod+D',
  rename: 'F2',
  delete: 'Delete',
  back: 'alt+ArrowLeft',
  forward: 'alt+ArrowRight',
  up: 'alt+ArrowUp',
  refresh: 'F5',
}

/** Drops the dividers that would be left at the edges or next to each other. */
export function collapseDividers<T>(items: T[], isDivider: (item: T) => boolean) {
  const result: T[] = []

  items.forEach((item) => {
    if (!isDivider(item) || (result.length > 0 && !isDivider(result[result.length - 1]))) {
      result.push(item)
    }
  })

  if (result.length > 0 && isDivider(result[result.length - 1])) {
    result.pop()
  }

  return result
}

/** Layouts offered by the view switch. */
export const DEFAULT_VIEWS: FileManagerViewName[] = ['details', 'list', 'grid', 'gallery', 'tree']
