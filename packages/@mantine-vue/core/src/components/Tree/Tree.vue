<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'
import type { TreeNodeData } from './Tree.types'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { levelOffset }) => ({
  root: { '--level-offset': getSpacing(levelOffset) },
}))

/**
 * The flat list of every value in tree order. Range selection needs it to work out
 * which nodes lie between the anchor and the clicked node.
 */
function getFlatValues(data: TreeNodeData[]): string[] {
  return data.flatMap((node) => [
    node.value,
    ...(node.children ? getFlatValues(node.children) : []),
  ])
}

export { varsResolver, getFlatValues }
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { Box, useStyles } from '../../core'
import type { TreeDragDropPayload } from './move-tree-node/move-tree-node'
import TreeNode from './TreeNode.vue'
import { useTree } from './use-tree'
import type { RenderTreeNodePayload, TreeDragState, TreeOwnProps, TreeSlots } from './Tree.types'
import classes from './Tree.module.css'

defineOptions({
  name: 'Tree',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeOwnProps>(), {
  component: 'ul',
  levelOffset: 'lg',
  expandOnClick: true,
  expandOnSpace: true,
  checkOnSpace: false,
  selectOnClick: false,
  clearSelectionOnOutsideClick: false,
  allowRangeSelection: true,
  keepMounted: false,
  withDragHandle: false,
  withLines: false,
  unstyled: false,
})

const emit = defineEmits<{
  'drag-drop': [payload: TreeDragDropPayload]
}>()

defineSlots<TreeSlots>()

const slots = useSlots()
const attrs = useAttrs()

/** Created unconditionally: hooks cannot be called behind a branch. */
const defaultController = useTree()
const controller = () => props.tree || defaultController

const root = ref<any>(null)
const dragState = ref<TreeDragState>({ draggedValue: null, currentDropTarget: null })

const getStyles = useStyles({
  name: 'Tree',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

// Also re-runs when the controller is swapped, so a new controller learns the data.
watch([() => props.data, () => props.tree], () => controller().initialize(props.data), {
  immediate: true,
})

function onDocumentMouseDown(event: MouseEvent) {
  const element = (root.value?.$el ?? root.value) as HTMLElement | null

  if (props.clearSelectionOnOutsideClick && element && !element.contains(event.target as Node)) {
    controller().clearSelected()
  }
}

onMounted(() => document.addEventListener('mousedown', onDocumentMouseDown))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentMouseDown))

const flatValues = computed(() => getFlatValues(props.data))

/**
 * The `renderNode`/`node` slots win over the `renderNode` prop, matching `resolveNode`'s
 * slot-first precedence. `renderNode` wins over its `node` alias. The result is a plain
 * function threaded uniformly to every recursive `TreeNode`, so flipping the precedence
 * here does not affect nested rendering.
 */
const renderNode = computed(
  () =>
    (slots.renderNode
      ? (payload: RenderTreeNodePayload) => slots.renderNode?.(payload)
      : slots.node
        ? (payload: RenderTreeNodePayload) => slots.node?.(payload)
        : undefined) || props.renderNode,
)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

function onDragDrop(payload: TreeDragDropPayload) {
  emit('drag-drop', payload)
}
</script>

<template>
  <Box
    ref="root"
    v-bind="{ ...attrs, ...rootStyles }"
    :component="props.component"
    role="tree"
    :aria-multiselectable="controller().multiple"
    data-tree-root=""
    :data-with-lines="props.withLines || undefined"
  >
    <TreeNode
      v-for="(node, index) in props.data"
      :key="node.value"
      :node="node"
      :get-styles="getStyles"
      :root-index="index"
      :controller="controller()"
      :flat-values="flatValues"
      :expand-on-click="props.expandOnClick"
      :select-on-click="props.selectOnClick"
      :allow-range-selection="props.allowRangeSelection"
      :expand-on-space="props.expandOnSpace"
      :check-on-space="props.checkOnSpace"
      :keep-mounted="props.keepMounted"
      :on-drag-drop="onDragDrop"
      :allow-drop="props.allowDrop"
      :with-drag-handle="props.withDragHandle"
      :drag-state="dragState as any"
      :data="props.data"
      :render-node="renderNode"
    />
  </Box>
</template>
