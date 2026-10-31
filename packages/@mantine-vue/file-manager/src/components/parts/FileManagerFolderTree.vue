<script setup lang="ts">
import { computed, h, onMounted, watch } from 'vue'
import { Loader, Tree, UnstyledButton, useTree } from '@mantine-vue/core'
import type { RenderTreeNodePayload, TreeNodeData } from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'
import { ROOT_FOLDER_KEY } from '../../composables/use-file-manager-ui'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileEntry } from '../../types'

defineOptions({ name: 'FileManagerFolderTree' })

const props = withDefaults(
  defineProps<{
    /** Key of the highlighted folder. Follows the current location when not set. */
    selected?: string

    /** Accessible name of the tree. */
    label?: string

    /** Whether folders accept dragged entries. */
    withDrop?: boolean
  }>(),
  { selected: undefined, label: undefined, withDrop: false },
)

const emit = defineEmits<{
  /** Emitted when a folder is chosen. */
  select: [folderId: string | null]
}>()

const { controller, labels, ui, getStyles } = useFileManagerContext()

const toId = (value: string) => (value === ROOT_FOLDER_KEY ? null : value)

const tree = useTree({
  initialExpandedState: { [ROOT_FOLDER_KEY]: true },
  onLoadChildren: (value) => controller.loadFolderChildren(toId(value)),
})

function toNode(entry: FileEntry): TreeNodeData {
  const children = controller.getFolderChildren(entry.id)

  return {
    value: entry.id,
    label: entry.name,
    children: children?.map(toNode),
    hasChildren: children ? undefined : entry.hasChildren !== false,
  }
}

const data = computed<TreeNodeData[]>(() => [
  {
    value: ROOT_FOLDER_KEY,
    label: labels.value.home,
    children: controller.getFolderChildren(null)?.map(toNode) ?? [],
    hasChildren: true,
  },
])

/** The root folder has an id of its own, which the tree knows as the root key. */
const currentKey = computed(() => {
  const { location, folder } = controller

  if (location.value.type !== 'folder') {
    return undefined
  }

  return folder.value?.parentId === null || location.value.id === null
    ? ROOT_FOLDER_KEY
    : (location.value.id ?? undefined)
})

const selectedKey = computed(() => props.selected ?? currentKey.value)

onMounted(() => {
  if (!controller.getFolderChildren(null)) {
    void controller.loadFolderChildren(null).catch(() => undefined)
  }
})

// Reveals the current folder when it was reached by other means than the tree.
watch(
  controller.ancestors,
  (ancestors) => {
    if (props.selected !== undefined) {
      return
    }

    ancestors.forEach((ancestor) => {
      if (ancestor.parentId !== null) {
        tree.expand(ancestor.id)
      }
    })
  },
  { immediate: true },
)

function choose(value: string) {
  emit('select', toId(value))
}

/** Enter chooses the focused folder. Arrow keys and Space are handled by `Tree`. */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return
  }

  const value = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')?.dataset
    .value

  if (value) {
    event.preventDefault()
    choose(value)
  }
}

const renderNode = ({
  node,
  expanded,
  hasChildren,
  isLoading,
  elementProps,
  tree: controllerTree,
}: RenderTreeNodePayload) => {
  const entry = node.value === ROOT_FOLDER_KEY ? null : node

  return h(
    'div',
    {
      ...elementProps,
      ...getStyles('treeNode'),
      ...(props.withDrop ? ui.getDropTargetProps(() => toId(node.value)) : null),
      'data-selected': node.value === selectedKey.value || undefined,
      'data-drop-target': ui.dropTarget.value === node.value || undefined,
      onClick: (event: MouseEvent) => {
        ;(elementProps as any).onClick?.(event)
        choose(node.value)
      },
    },
    [
      h(
        UnstyledButton as any,
        {
          tabindex: -1,
          'aria-hidden': true,
          'data-expanded': expanded || undefined,
          style: { visibility: hasChildren ? 'visible' : 'hidden' },
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            controllerTree.toggleExpanded(node.value)
          },
        },
        () =>
          isLoading
            ? h(Loader, { size: 12 })
            : h(FileManagerIcon, { name: 'chevronRight', size: 14 }),
      ),
      h(FileManagerIcon, { name: entry ? 'folder' : 'home', size: 16, 'data-folder-icon': true }),
      h('span', { 'data-label': true }, node.label as string),
    ],
  )
}
</script>

<template>
  <Tree
    :data="data"
    :tree="tree"
    :render-node="renderNode"
    :expand-on-click="false"
    :level-offset="14"
    :aria-label="props.label ?? labels.folderTree"
    @keydown="onKeydown"
  />
</template>
