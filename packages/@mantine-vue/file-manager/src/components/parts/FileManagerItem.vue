<script setup lang="ts">
import { computed } from 'vue'
import { ActionIcon, Checkbox, Loader, UnstyledButton } from '@mantine-vue/core'
import { getFileCategory } from '../../core/file-types'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileEntry } from '../../types'
import FileManagerThumbnail from './FileManagerThumbnail.vue'

defineOptions({ name: 'FileManagerItem' })

const props = withDefaults(
  defineProps<{
    /** Entry shown by this item. */
    entry: FileEntry

    /** Name of the active layout. */
    view: string

    /** Whether the layout draws cards rather than rows. */
    card?: boolean

    /** Whether the entry is selected. */
    selected?: boolean

    /** Whether this item is the tab stop of the list. */
    active?: boolean

    /** Whether the entry waits on the clipboard to be moved. */
    cut?: boolean

    /** Nesting level in the tree layout. */
    depth?: number

    /** Whether a drag is hovering this item. */
    dropTarget?: boolean

    /** Whether the entry can be dragged. */
    draggable?: boolean
  }>(),
  {
    card: false,
    selected: false,
    active: false,
    cut: false,
    depth: 0,
    dropTarget: false,
    draggable: false,
  },
)

const { controller, labels, config, compact, getStyles, slots } = useFileManagerContext()

const isTree = computed(() => props.view === 'tree')
const isFolder = computed(() => props.entry.kind === 'folder')
const expanded = computed(() => controller.treeExpanded.value.has(props.entry.id))
const loadingChildren = computed(() => controller.treeLoading.value.has(props.entry.id))

const secondary = computed(() =>
  isFolder.value
    ? props.entry.childCount !== undefined
      ? labels.value.itemsCount(props.entry.childCount)
      : labels.value.folderKind
    : config.value.formatters.size(props.entry.size),
)

const showCheckbox = computed(
  () => compact.value || props.selected || controller.selection.value.size > 0,
)

const itemStyles = computed(() =>
  getStyles('item', props.depth > 0 ? { style: { '--fm-depth': props.depth } } : undefined),
)

function onCheck() {
  controller.select(props.entry.id, 'toggle')
}
</script>

<template>
  <div
    v-bind="itemStyles"
    role="gridcell"
    :tabindex="props.active ? 0 : -1"
    :aria-selected="props.selected"
    :aria-label="props.entry.name"
    :data-entry-id="props.entry.id"
    :data-kind="props.entry.kind"
    :data-category="getFileCategory(props.entry)"
    :data-view="props.view"
    :data-card="props.card || undefined"
    :data-selected="props.selected || undefined"
    :data-cut="props.cut || undefined"
    :data-drop-target="props.dropTarget || undefined"
    :draggable="props.draggable"
  >
    <component
      :is="slots.item"
      v-if="slots.item"
      :entry="props.entry"
      :selected="props.selected"
      :active="props.active"
      :cut="props.cut"
      :depth="props.depth"
    />

    <template v-else>
      <UnstyledButton
        v-if="isTree"
        v-bind="getStyles('itemControl')"
        data-fm-expander
        tabindex="-1"
        :data-expanded="expanded || undefined"
        :aria-label="
          expanded ? labels.collapseFolder(props.entry.name) : labels.expandFolder(props.entry.name)
        "
        :style="{ visibility: isFolder ? 'visible' : 'hidden' }"
      >
        <Loader v-if="loadingChildren" :size="12" />
        <FileManagerIcon v-else name="chevronRight" :size="14" />
      </UnstyledButton>

      <span
        v-bind="getStyles('itemControl')"
        data-fm-checkbox
        :data-visible="showCheckbox || undefined"
      >
        <Checkbox
          size="xs"
          tabindex="-1"
          :checked="props.selected"
          :aria-label="labels.selectItem(props.entry.name)"
          @update:checked="onCheck"
        />
      </span>

      <FileManagerThumbnail
        :entry="props.entry"
        :size="props.card ? 48 : 20"
        :with-thumbnail="props.card"
      />

      <span v-bind="getStyles('itemName')" :title="props.entry.name">{{ props.entry.name }}</span>

      <FileManagerIcon v-if="props.entry.starred" name="star" :size="12" data-fm-star />

      <span v-if="secondary && (props.card || !compact)" v-bind="getStyles('itemMeta')">
        {{ secondary }}
      </span>

      <ActionIcon
        v-bind="getStyles('itemControl')"
        data-fm-more
        variant="subtle"
        color="gray"
        size="sm"
        tabindex="-1"
        :aria-label="labels.itemActions(props.entry.name)"
      >
        <FileManagerIcon name="dots" :size="14" />
      </ActionIcon>
    </template>
  </div>
</template>
