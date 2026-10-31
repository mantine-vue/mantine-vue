<script lang="ts">
import { createVarsResolver, getRadius, getThemeColor } from '@mantine-vue/core'
import { DEFAULT_VIEWS } from '../../actions'
import type { FileManagerItemSize, FileManagerViewDefinition } from '../../FileManager.context'

const defaultProps = {
  layout: 'auto',
  compactBreakpoint: 620,
  itemSize: 'md',
  virtualize: 'auto',
  virtualizeThreshold: 100,
  draggable: true,
  withNotices: true,
  confirm: true,
} as const

const varsResolver = createVarsResolver<any>((theme, { color, folderColor, radius, itemSize }) => {
  const accent = color ? theme.variantColorResolver({ color, theme, variant: 'light' }) : undefined

  const vars = {
    '--fm-accent': color ? getThemeColor(color, theme) : undefined,
    '--fm-accent-light': accent?.background,
    '--fm-folder-color': folderColor ? getThemeColor(folderColor, theme) : undefined,
    '--fm-radius': radius !== undefined ? getRadius(radius) : undefined,
    '--fm-row-height': `${getRowHeight(itemSize)}px`,
  }

  return { root: vars, portal: vars }
})

function getRowHeight(size: FileManagerItemSize) {
  return { sm: 36, md: 44, lg: 52 }[size]
}

/** Dimensions of the built-in layouts for a size preset. */
function getBuiltInView(name: string, size: FileManagerItemSize): FileManagerViewDefinition | null {
  const rowHeight = getRowHeight(size)

  switch (name) {
    case 'details':
    case 'list':
      return { name, layout: 'list', rowHeight }
    case 'tree':
      return { name, layout: 'list', rowHeight }
    case 'grid':
      return {
        name,
        layout: 'grid',
        rowHeight: { sm: 120, md: 144, lg: 176 }[size],
        minItemWidth: { sm: 112, md: 136, lg: 168 }[size],
      }
    case 'gallery':
      return {
        name,
        layout: 'grid',
        rowHeight: { sm: 168, md: 216, lg: 288 }[size],
        minItemWidth: { sm: 160, md: 216, lg: 296 }[size],
      }
    default:
      return null
  }
}

export { defaultProps, varsResolver, getBuiltInView }
</script>

<script setup lang="ts">
import { computed, onMounted, useAttrs, useSlots, watch, type ComputedRef } from 'vue'
import { Box, Drawer, Splitter, Text, useProps, useStyles } from '@mantine-vue/core'
import { getHotkeyHandler, useResizeObserver } from '@mantine-vue/hooks'
import { useDropzone } from '@mantine-vue/dropzone'
import {
  DEFAULT_BACKGROUND_MENU,
  DEFAULT_ITEM_MENU,
  DEFAULT_SELECTION_BAR,
  DEFAULT_SHORTCUTS,
  DEFAULT_TOOLBAR_ACTIONS,
} from '../../actions'
import { useFileManager } from '../../composables/use-file-manager'
import { ROOT_FOLDER_KEY, useFileManagerUi } from '../../composables/use-file-manager-ui'
import { DEFAULT_FILE_MANAGER_FORMATTERS } from '../../core/format'
import {
  BUILT_IN_ACTION_MAP,
  provideFileManagerContext,
  type FileManagerConfig,
  useActionContext,
} from '../../FileManager.context'
import FileManagerContent from '../parts/FileManagerContent.vue'
import FileManagerContextMenu from '../parts/FileManagerContextMenu.vue'
import FileManagerDetailsPanel from '../parts/FileManagerDetailsPanel.vue'
import FileManagerDialogs from '../parts/FileManagerDialogs.vue'
import FileManagerNotices from '../parts/FileManagerNotices.vue'
import FileManagerPreview from '../parts/FileManagerPreview.vue'
import FileManagerSelectionBar from '../parts/FileManagerSelectionBar.vue'
import FileManagerSidebar from '../parts/FileManagerSidebar.vue'
import FileManagerStatusBar from '../parts/FileManagerStatusBar.vue'
import FileManagerToolbar from '../parts/FileManagerToolbar.vue'
import FileManagerUploadPanel from '../parts/FileManagerUploadPanel.vue'
import type { FileManagerEmits, FileManagerOwnProps, FileManagerSlots } from './FileManager.types'
import classes from './FileManager.module.css'

defineOptions({
  name: 'FileManager',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<FileManagerOwnProps>(), {
  adapter: undefined,
  controller: undefined,
  folderId: undefined,
  defaultFolderId: undefined,
  view: undefined,
  defaultView: undefined,
  sort: undefined,
  defaultSort: undefined,
  filters: undefined,
  defaultFilters: undefined,
  selectedIds: undefined,
  defaultSelectedIds: undefined,
  layout: undefined,
  compactBreakpoint: undefined,
  itemSize: undefined,
  color: undefined,
  folderColor: undefined,
  radius: undefined,
  sections: undefined,
  views: undefined,
  toolbarActions: undefined,
  itemMenu: undefined,
  backgroundMenu: undefined,
  selectionActions: undefined,
  actions: undefined,
  resolveMenu: undefined,
  shortcuts: undefined,
  icons: undefined,
  fileIcons: undefined,
  previewRenderers: undefined,
  formatters: undefined,
  labels: undefined,
  pagination: undefined,
  pageSize: undefined,
  virtualize: undefined,
  virtualizeThreshold: undefined,
  cache: undefined,
  foldersFirst: undefined,
  sortFields: undefined,
  entryFilter: undefined,
  recursiveSearch: undefined,
  restrictions: undefined,
  uploadConcurrency: undefined,
  chunkSize: undefined,
  conflictStrategy: undefined,
  confirm: undefined,
  draggable: undefined,
  openOnSingleClick: undefined,
  withNotices: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<FileManagerEmits>()
defineSlots<FileManagerSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('FileManager', defaultProps, rawProps)

if (!props.adapter && !props.controller) {
  throw new Error('FileManager needs an `adapter` or a `controller`')
}

const getStyles = useStyles({
  name: 'FileManager',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const controller =
  props.controller ??
  useFileManager({
    adapter: () => props.adapter!,
    labels: () => props.labels,
    initialFolderId: props.folderId ?? props.defaultFolderId,
    initialView: props.view ?? props.defaultView,
    initialSort: props.sort ?? props.defaultSort,
    initialFilters: props.filters ?? props.defaultFilters,
    initialSelection: props.selectedIds ?? props.defaultSelectedIds,
    foldersFirst: () => props.foldersFirst,
    pagination: () => props.pagination,
    pageSize: () => props.pageSize,
    cache: () => props.cache,
    entryFilter: computed(() => props.entryFilter),
    recursiveSearch: () => props.recursiveSearch,
    restrictions: () => props.restrictions,
    uploadConcurrency: () => props.uploadConcurrency,
    chunkSize: () => props.chunkSize,
    conflictStrategy: () => props.conflictStrategy,
    onOpenFile: (entry) => {
      emit('open', entry)
    },
  })

const labels = controller.labels

const ui = useFileManagerUi(controller, { restrictions: () => props.restrictions })

controller.setHandlers({
  notify: (notice) => {
    emit('notice', notice)

    if (props.withNotices) {
      ui.pushNotice(notice)
    }
  },
})

watch(
  () => props.confirm,
  (value) => {
    controller.confirmOptions.value = value ?? true
  },
  { immediate: true },
)

/* Responsive layout */

const { ref: measuredRoot, rect } = useResizeObserver<HTMLElement>()

const setRootElement = (node: unknown) => {
  measuredRoot.value = ((node as any)?.$el ?? node) as HTMLElement | null
}

/** A width of `0` means nothing was measured yet. The desktop layout is the safer assumption. */
const compact = computed(() => {
  if (props.layout !== 'auto') {
    return props.layout === 'compact'
  }

  return rect.value.width > 0 && rect.value.width < props.compactBreakpoint!
})

watch(compact, (value) => {
  if (!value) {
    ui.sidebarOpened.value = false
    ui.selectionMode.value = false
  }
})

/* Configuration shared with the parts */

const views = computed(() =>
  (props.views ?? DEFAULT_VIEWS).flatMap((view) => {
    const definition = typeof view === 'string' ? getBuiltInView(view, props.itemSize!) : view

    return definition ? [definition] : []
  }),
)

const config: ComputedRef<FileManagerConfig> = computed(() => ({
  sections: {
    toolbar: true,
    breadcrumbs: true,
    sidebar: true,
    statusBar: true,
    details: true,
    search: true,
    filters: true,
    sort: true,
    viewSwitch: true,
    quickAccess: true,
    folderTree: true,
    ...props.sections,
  },
  views: views.value,
  itemSize: props.itemSize!,
  toolbarActions: props.toolbarActions ?? DEFAULT_TOOLBAR_ACTIONS,
  itemMenu: props.itemMenu ?? DEFAULT_ITEM_MENU,
  backgroundMenu: props.backgroundMenu ?? DEFAULT_BACKGROUND_MENU,
  selectionActions: props.selectionActions ?? DEFAULT_SELECTION_BAR,
  actions: new Map([
    ...BUILT_IN_ACTION_MAP,
    ...(props.actions ?? []).map((action) => [action.id, action] as const),
  ]),
  resolveMenu: props.resolveMenu,
  icons: props.icons ?? {},
  fileIcons: props.fileIcons ?? {},
  previewRenderers: props.previewRenderers ?? [],
  formatters: { ...DEFAULT_FILE_MANAGER_FORMATTERS, ...props.formatters },
  sortFields: props.sortFields ?? ['name', 'size', 'type', 'modifiedAt'],
  draggable: props.draggable!,
  virtualize: props.virtualize!,
  virtualizeThreshold: props.virtualizeThreshold!,
  openOnSingleClick: !!props.openOnSingleClick,
}))

provideFileManagerContext({ controller, labels, config, ui, getStyles, compact, slots })

/* Keyboard shortcuts */

const shortcutContext = useActionContext(
  { controller, labels, ui },
  'selection',
  () => controller.selectedEntries.value,
)

const onHotkey = computed(() => {
  if (props.shortcuts === false) {
    return () => {}
  }

  const shortcuts = { ...DEFAULT_SHORTCUTS, ...props.shortcuts }

  return getHotkeyHandler(
    Object.entries(shortcuts).flatMap(([id, hotkey]) => {
      const action = config.value.actions.get(id)

      return action
        ? [
            [
              hotkey,
              () => {
                const context = shortcutContext.value

                if ((action.visible?.(context) ?? true) && (action.enabled?.(context) ?? true)) {
                  void action.run(context)
                }
              },
            ] as [string, (event: KeyboardEvent) => void],
          ]
        : []
    }),
  )
})

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement

  // Typing in a field belongs to the field, including `Delete` and `mod+A`.
  if (!target.closest?.('input, textarea, select, [contenteditable="true"]')) {
    onHotkey.value(event)
  }
}

/* External files */

const dropzone = useDropzone({
  noClick: () => true,
  noKeyboard: () => true,
  disabled: () => !controller.capabilities.value.upload,
  onDrop: (files) => {
    const target = ui.dropTarget.value
    const parentId =
      target === null
        ? controller.currentFolderId.value
        : target === ROOT_FOLDER_KEY
          ? null
          : target

    ui.dropTarget.value = null

    // The default action of a drop has to stay prevented here, otherwise the browser would
    // navigate to the file. That is why the dropzone is not simply disabled in these locations.
    if (parentId === undefined || (target === null && !controller.canWriteHere.value)) {
      controller.notify({
        status: 'error',
        title: labels.value.upload,
        message: labels.value.errors['permission-denied'],
      })
      return
    }

    controller.upload(
      files.map((file) => ({
        file,
        relativePath:
          controller.capabilities.value.folderUpload && file.path?.includes('/')
            ? file.path
            : undefined,
      })),
      parentId,
    )
  },
})

const dropzoneProps = computed<Record<string, any>>(() => {
  const { role: _role, ref: _ref, tabindex: _tabindex, ...handlers } = dropzone.getRootProps()

  return handlers
})

const canDropHere = computed(
  () => controller.capabilities.value.upload && controller.canWriteHere.value,
)

/* Controlled state */

function syncProp<T>(source: () => T | undefined, apply: (value: T) => void) {
  watch(source, (value) => {
    if (value !== undefined) {
      apply(value)
    }
  })
}

syncProp(
  () => props.folderId,
  (id) => {
    const current = controller.location.value

    if (current.type !== 'folder' || (current.id !== id && controller.folder.value?.id !== id)) {
      void controller.openFolder(id)
    }
  },
)
syncProp(
  () => props.view,
  (value) => {
    controller.view.value = value
  },
)
syncProp(
  () => props.sort,
  (value) => {
    if (value !== controller.sort.value) {
      controller.setSort(value)
    }
  },
)
syncProp(
  () => props.filters,
  (value) => {
    if (value !== controller.filters.value) {
      controller.setFilters(value)
    }
  },
)
syncProp(
  () => props.selectedIds,
  (ids) => {
    if (ids.length !== controller.selection.value.size || !ids.every(controller.isSelected)) {
      controller.setSelection(ids)
    }
  },
)

watch(controller.view, (value) => emit('update:view', value))
watch(controller.sort, (value) => emit('update:sort', value))
watch(controller.filters, (value) => emit('update:filters', value))
watch(controller.selection, (value) => emit('update:selectedIds', [...value]))
watch(controller.location, (value) => {
  emit('locationChange', value)

  if (value.type === 'folder') {
    emit('update:folderId', value.id)
  }
})

onMounted(() => {
  void controller.load()
})

defineExpose({ controller })

const withSidebar = computed(() => config.value.sections.sidebar && ui.sidebarVisible.value)
const withDetails = computed(() => config.value.sections.details && ui.detailsOpened.value)

/** The number of panes changes the layout, so the splitter starts over with fresh sizes. */
const paneKey = computed(() => `${withSidebar.value}-${withDetails.value}`)
const sidebarDrawerOpened = computed(() => compact.value && ui.sidebarOpened.value)
const detailsDrawerOpened = computed(() => compact.value && withDetails.value)
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs

  return rest
})

const dropLabel = computed(() => {
  const target = controller.visibleEntries.value.find((entry) => entry.id === ui.dropTarget.value)

  return target ? labels.value.dropToUploadInto(target.name) : labels.value.dropToUpload
})

const closeSidebar = () => {
  ui.sidebarOpened.value = false
}

const closeDetails = () => {
  ui.detailsOpened.value = false
}

const dragActive = computed(
  () => dropzone.isDragActive.value && (canDropHere.value || ui.dropTarget.value !== null),
)
</script>

<template>
  <Box
    v-bind="{ ...rootAttrs, ...getStyles('root') }"
    :ref="setRootElement"
    role="region"
    :aria-label="labels.root"
    :mod="{ compact }"
    @keydown="onKeydown"
  >
    <div v-bind="{ ...dropzoneProps, ...getStyles('dropzone') }">
      <slot name="layout" :controller="controller" :compact="compact">
        <FileManagerToolbar v-if="config.sections.toolbar" />

        <div v-bind="getStyles('body')">
          <FileManagerContent v-if="compact" />

          <Splitter v-else :key="paneKey">
            <Splitter.Pane
              v-if="withSidebar"
              :default-size="withDetails ? 20 : 22"
              :min="12"
              :max="40"
            >
              <FileManagerSidebar />
            </Splitter.Pane>
            <Splitter.Pane :default-size="withSidebar ? (withDetails ? 56 : 78) : 75" :min="30">
              <FileManagerContent />
            </Splitter.Pane>
            <Splitter.Pane v-if="withDetails" :default-size="24" :min="16" :max="40">
              <FileManagerDetailsPanel />
            </Splitter.Pane>
          </Splitter>
        </div>

        <FileManagerSelectionBar v-if="compact" />
        <FileManagerStatusBar v-if="config.sections.statusBar" />
      </slot>

      <Text
        v-if="dragActive"
        v-bind="getStyles('dropOverlay')"
        component="div"
        :fw="500"
        aria-hidden="true"
      >
        {{ dropLabel }}
      </Text>

      <FileManagerUploadPanel />
      <FileManagerNotices />
    </div>

    <Drawer
      v-if="config.sections.sidebar"
      v-bind="getStyles('portal')"
      :opened="sidebarDrawerOpened"
      :title="labels.sidebar"
      size="85%"
      @close="closeSidebar"
    >
      <FileManagerSidebar />
    </Drawer>

    <Drawer
      v-if="config.sections.details"
      v-bind="getStyles('portal')"
      :opened="detailsDrawerOpened"
      :title="labels.details"
      position="bottom"
      size="70%"
      @close="closeDetails"
    >
      <FileManagerDetailsPanel />
    </Drawer>

    <FileManagerContextMenu />
    <FileManagerDialogs />
    <FileManagerPreview />
  </Box>
</template>
