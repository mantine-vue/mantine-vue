import { computed, type Component, type ComputedRef } from 'vue'
import { createSafeContext } from '@mantine-vue/core'
import {
  BUILT_IN_ACTIONS,
  collapseDividers,
  type FileManagerAction,
  type FileManagerActionContext,
  type FileManagerActionScope,
  type FileManagerMenuItem,
  type FileManagerUiActions,
} from './actions'
import type { FileManagerController, FileManagerViewName } from './composables/use-file-manager'
import type { FileManagerFormatters } from './core/format'
import type { FileManagerIconName } from './icons/icon-paths'
import type { FileManagerLabels } from './labels'
import type { FileManagerUi } from './composables/use-file-manager-ui'
import type { FileCategory, FileEntry } from './types'

/** Size preset of rows and cards. */
export type FileManagerItemSize = 'sm' | 'md' | 'lg'

/** Props passed to the component of a custom view. */
export interface FileManagerViewItemProps {
  entry: FileEntry
  selected: boolean
  active: boolean
  cut: boolean
  depth: number
}

/**
 * Describes a layout of the content area.
 *
 * Every layout is a window over the same ordered entries, so selection, keyboard navigation,
 * drag and drop and context menus keep working in custom ones too.
 */
export interface FileManagerViewDefinition {
  name: FileManagerViewName
  label?: string
  icon?: FileManagerIconName | Component

  /** `list` shows one entry per row, `grid` as many as fit. */
  layout: 'list' | 'grid'

  /** Height of a row in px. */
  rowHeight: number

  /** Smallest width of a cell in px, for `grid` layouts. */
  minItemWidth?: number

  /** Renders one entry. Receives `FileManagerViewItemProps`. */
  component?: Component
}

/** Sections that can be hidden. */
export interface FileManagerSections {
  toolbar?: boolean
  breadcrumbs?: boolean
  sidebar?: boolean
  statusBar?: boolean
  details?: boolean
  search?: boolean
  filters?: boolean
  sort?: boolean
  viewSwitch?: boolean
  quickAccess?: boolean
  folderTree?: boolean
}

export type FileManagerIconOverrides = Partial<Record<FileManagerIconName, Component>>
export type FileManagerFileIcons = Partial<Record<FileCategory, Component>>

/** One renderer of the preview. The first matching entry of `previewRenderers` wins. */
export interface FileManagerPreviewRenderer {
  /** Decides whether this renderer handles the entry. */
  test: (entry: FileEntry) => boolean

  /** Receives `entry`, `source` and `url`. */
  component: Component
}

export interface FileManagerConfig {
  sections: Required<FileManagerSections>
  views: FileManagerViewDefinition[]
  itemSize: FileManagerItemSize
  itemMenu: FileManagerMenuItem[]
  backgroundMenu: FileManagerMenuItem[]
  toolbarActions: FileManagerMenuItem[]
  selectionActions: FileManagerMenuItem[]
  actions: Map<string, FileManagerAction>
  resolveMenu?: (
    items: FileManagerAction[],
    context: FileManagerActionContext,
  ) => FileManagerAction[]
  icons: FileManagerIconOverrides
  fileIcons: FileManagerFileIcons
  previewRenderers: FileManagerPreviewRenderer[]
  formatters: FileManagerFormatters
  sortFields: ('name' | 'size' | 'type' | 'modifiedAt')[]
  draggable: boolean
  virtualize: boolean | 'auto'
  virtualizeThreshold: number
  openOnSingleClick: boolean
}

export interface FileManagerContextValue {
  controller: FileManagerController
  labels: ComputedRef<FileManagerLabels>
  config: ComputedRef<FileManagerConfig>
  ui: FileManagerUi

  /** Styles API of the root component. */
  getStyles: (selector: any, options?: any) => any

  /** Whether the compact layout is active. */
  compact: ComputedRef<boolean>

  /** Slots of the root component, for the parts that render inside nested components. */
  slots: Record<string, ((payload: any) => any) | undefined>
}

export const [provideFileManagerContext, useFileManagerContext] =
  createSafeContext<FileManagerContextValue>(
    'FileManager parts must be rendered inside a FileManager',
  )

export interface ResolvedMenuAction {
  action: FileManagerAction | null
  key: string
  label: string
  enabled: boolean
}

export const BUILT_IN_ACTION_MAP = new Map(BUILT_IN_ACTIONS.map((action) => [action.id, action]))

/** Filters a menu definition for a context, keeping only what the backend supports. */
export function resolveMenuItems(
  items: FileManagerMenuItem[],
  context: FileManagerActionContext,
  config: Pick<FileManagerConfig, 'actions' | 'resolveMenu'>,
): ResolvedMenuAction[] {
  const actions = items.flatMap((item, index): (FileManagerAction | { divider: number })[] => {
    if (item === 'divider') {
      return [{ divider: index }]
    }

    const action = typeof item === 'string' ? config.actions.get(item) : item

    return action && (action.visible?.(context) ?? true) ? [action] : []
  })

  const isDivider = (item: (typeof actions)[number]) => 'divider' in item
  const collapsed = collapseDividers(actions, isDivider)
  const custom = config.resolveMenu
    ? config.resolveMenu(
        collapsed.filter((item) => !isDivider(item)) as FileManagerAction[],
        context,
      )
    : null

  return (custom ?? collapsed).map((item, index) =>
    'divider' in item
      ? { action: null, key: `divider-${index}`, label: '', enabled: false }
      : {
          action: item,
          key: item.id,
          label: typeof item.label === 'function' ? item.label(context) : item.label,
          enabled: item.enabled?.(context) ?? true,
        },
  )
}

export function useActionContext(
  ctx: Pick<FileManagerContextValue, 'controller' | 'labels' | 'ui'>,
  scope: FileManagerActionScope,
  entries: () => FileEntry[],
) {
  return computed<FileManagerActionContext>(() => ({
    controller: ctx.controller,
    labels: ctx.labels.value,
    ui: ctx.ui.actions as FileManagerUiActions,
    entries: entries(),
    scope,
  }))
}
