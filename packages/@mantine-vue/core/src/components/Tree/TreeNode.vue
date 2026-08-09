<script lang="ts">
import type { TreeDragDropPayload } from './move-tree-node/move-tree-node'
import type { TreeAllowDrop } from './use-tree-node-drag-drop'
import type { TreeController } from './use-tree'
import type { RenderNode, TreeDragState, TreeNodeData } from './Tree.types'

/** Props of `TreeNode`. This component is internal to `Tree`. */
export interface TreeNodeProps {
  /** Data of the node. */
  node: TreeNodeData

  /** `getStyles` of the owning `Tree`, so every node shares one Styles API instance. */
  getStyles: any

  /** Index among the root nodes. Only the first root node is in the tab order. */
  rootIndex?: number

  /** Controller of the owning tree. */
  controller: TreeController

  /** If set, the node expands and collapses when it is clicked. */
  expandOnClick?: boolean

  /** Every value of the tree in tree order, used to resolve range selections. */
  flatValues: string[]

  /** Whether this node is nested inside another node. */
  isSubtree?: boolean

  /** Depth of the node, starting at 1. */
  level?: number

  /** Custom markup for the node. */
  renderNode?: RenderNode

  /** If set, the node is selected when it is clicked. */
  selectOnClick?: boolean

  /** If set, a range of nodes can be selected by holding `Shift`. */
  allowRangeSelection?: boolean

  /** If set, the node expands and collapses when `Space` is pressed. */
  expandOnSpace?: boolean

  /** If set, the node is checked and unchecked when `Space` is pressed. */
  checkOnSpace?: boolean

  /** If set, the children stay mounted while the node is collapsed. */
  keepMounted?: boolean

  /** Called when a node is dropped onto another node. */
  onDragDrop?: (payload: TreeDragDropPayload) => void

  /** Decides whether a node may be dropped at a given position. */
  allowDrop?: TreeAllowDrop

  /** If set, the node is dragged with a dedicated handle. */
  withDragHandle?: boolean

  /** Drag and drop state shared by every node of the tree. */
  dragState: { value: TreeDragState }

  /** Data of the whole tree, needed to resolve drop targets. */
  data: TreeNodeData[]
}

/** Every value between the anchor and the clicked node, in tree order. */
function getValuesRange(anchor: string | null, value: string | undefined, flatValues: string[]) {
  if (!anchor || !value) {
    return []
  }

  const first = flatValues.indexOf(anchor)
  const second = flatValues.indexOf(value)

  if (first === -1 || second === -1) {
    return []
  }

  return flatValues.slice(Math.min(first, second), Math.max(first, second) + 1)
}

/**
 * `keepMounted` hides collapsed subtrees with `display: none` instead of unmounting
 * them, so arrow key navigation has to skip anything inside a hidden ancestor.
 */
function visible(node: HTMLElement, root: Element) {
  for (
    let current: HTMLElement | null = node;
    current && current !== root;
    current = current.parentElement
  ) {
    if (current.style.display === 'none') {
      return false
    }
  }

  return true
}

export { getValuesRange, visible }
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Box } from '../../core'
import { Loader } from '../Loader'
import { useTreeNodeDragDrop } from './use-tree-node-drag-drop'

defineOptions({
  name: 'TreeNode',
})

const props = withDefaults(defineProps<TreeNodeProps>(), {
  rootIndex: undefined,
  expandOnClick: true,
  isSubtree: false,
  level: 1,
  renderNode: undefined,
  selectOnClick: false,
  allowRangeSelection: true,
  expandOnSpace: true,
  checkOnSpace: false,
  keepMounted: false,
  withDragHandle: false,
})

const element = ref<HTMLElement | null>(null)

/** A node is expandable once it has loaded children, or is marked as having some. */
const hasChildren = () => {
  const hasLoadedChildren = Array.isArray(props.node.children) && props.node.children.length > 0
  return hasLoadedChildren || (!!props.node.hasChildren && !hasLoadedChildren)
}

const expanded = () => props.controller.expandedState.value[props.node.value] || false

const dnd = useTreeNodeDragDrop({
  nodeValue: props.node.value,
  hasChildren,
  isExpanded: expanded,
  data: () => props.data,
  onDragDrop: props.onDragDrop,
  dragState: props.dragState as any,
  allowDrop: props.allowDrop,
  withDragHandle: props.withDragHandle,
})

function onKeydown(event: KeyboardEvent) {
  if (event.code === 'ArrowRight') {
    event.stopPropagation()
    event.preventDefault()

    // Right expands a collapsed node, then moves into it once it is open.
    if (expanded()) {
      const nextNode = element.value?.querySelector<HTMLElement>('[role=treeitem]')
      nextNode?.setAttribute('data-focus-ring', 'true')
      nextNode?.focus()
    } else if (hasChildren()) {
      props.controller.expand(props.node.value)
    }
  } else if (event.code === 'ArrowLeft') {
    event.stopPropagation()
    event.preventDefault()

    // Left collapses an open node, then moves out to the parent.
    if (expanded() && hasChildren()) {
      props.controller.collapse(props.node.value)
    } else if (props.isSubtree) {
      const parentNode = element.value?.parentElement?.closest<HTMLElement>('[role=treeitem]')
      parentNode?.setAttribute('data-focus-ring', 'true')
      parentNode?.focus()
    }
  } else if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
    const root = element.value?.closest('[data-tree-root]')

    if (!root || !element.value) {
      return
    }

    event.stopPropagation()
    event.preventDefault()

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[role=treeitem]')).filter((node) =>
      visible(node, root),
    )
    const index = nodes.indexOf(element.value)
    const next = nodes[event.code === 'ArrowDown' ? index + 1 : index - 1]

    next?.setAttribute('data-focus-ring', 'true')
    next?.focus()

    if (event.shiftKey && next) {
      props.controller.setSelectedState(
        getValuesRange(props.controller.anchorNode.value, next.dataset.value, props.flatValues),
      )
    }
  } else if (event.code === 'Space') {
    if (props.expandOnSpace && hasChildren()) {
      event.stopPropagation()
      event.preventDefault()
      props.controller.toggleExpanded(props.node.value)
    }

    if (props.checkOnSpace) {
      event.stopPropagation()
      event.preventDefault()

      if (props.controller.isNodeChecked(props.node.value)) {
        props.controller.uncheckNode(props.node.value)
      } else {
        props.controller.checkNode(props.node.value)
      }
    }
  }
}

function onBlur(event: FocusEvent) {
  const currentTarget = event.currentTarget as HTMLElement

  // The focus ring is kept while focus stays anywhere inside the node.
  if (!currentTarget.contains(event.relatedTarget as Node | null)) {
    currentTarget.removeAttribute('data-focus-ring')
  }
}

function onClick(event: MouseEvent) {
  event.stopPropagation()

  if (props.allowRangeSelection && event.shiftKey && props.controller.anchorNode.value) {
    props.controller.setSelectedState(
      getValuesRange(props.controller.anchorNode.value, props.node.value, props.flatValues),
    )
  } else {
    if (props.expandOnClick && hasChildren()) {
      props.controller.toggleExpanded(props.node.value)
    }

    if (props.selectOnClick) {
      props.controller.select(props.node.value)
    }
  }

  element.value?.focus()
}

const selected = computed(() => props.controller.selectedState.value.includes(props.node.value))
const isExpanded = computed(() => expanded())

const elementProps = computed(() => ({
  ...props.getStyles('label'),
  ...dnd.getElementProps(),
  onClick,
  'data-selected': selected.value || undefined,
  'data-value': props.node.value,
}))

const payload = computed(() => ({
  node: props.node,
  level: props.level,
  selected: selected.value,
  isRoot: props.level === 1,
  tree: props.controller,
  expanded: isExpanded.value,
  hasChildren: hasChildren(),
  isLoading: props.controller.isNodeLoading(props.node.value),
  loadError: props.controller.getNodeLoadError(props.node.value),
  elementProps: elementProps.value,
  dragHandleProps: dnd.dragHandleProps,
}))

/** Both the custom markup and the label may be VNodes, which cannot be interpolated. */
const renderLabel = () => (props.renderNode ? props.renderNode(payload.value) : null)

const renderNodeLabel = () =>
  typeof props.node.label === 'function' ? props.node.label() : props.node.label

const nodeStyles = computed(() =>
  props.getStyles('node', {
    // The root level is not indented, so the offset is one level behind the depth.
    style: { '--label-offset': `calc(var(--level-offset) * ${props.level - 1})` },
  }),
)

const loaderNodeStyles = computed(() =>
  props.getStyles('node', {
    style: { '--label-offset': `calc(var(--level-offset) * ${props.level})` },
  }),
)

const subtreeStyles = computed(() => props.getStyles('subtree'))

const nestedNodes = computed(() => props.node.children || [])

/** Async children have not arrived yet: show a loader in place of the subtree. */
const showLoader = computed(
  () => isExpanded.value && payload.value.isLoading && nestedNodes.value.length === 0,
)

const showSubtree = computed(
  () => nestedNodes.value.length > 0 && (isExpanded.value || props.keepMounted),
)

const subtreeStyle = computed(() => [
  subtreeStyles.value.style,
  !isExpanded.value ? { display: 'none' } : null,
])

/** Everything a child node inherits unchanged from this one. */
const childProps = computed(() => ({
  getStyles: props.getStyles,
  controller: props.controller,
  expandOnClick: props.expandOnClick,
  flatValues: props.flatValues,
  renderNode: props.renderNode,
  selectOnClick: props.selectOnClick,
  allowRangeSelection: props.allowRangeSelection,
  expandOnSpace: props.expandOnSpace,
  checkOnSpace: props.checkOnSpace,
  keepMounted: props.keepMounted,
  onDragDrop: props.onDragDrop,
  allowDrop: props.allowDrop,
  withDragHandle: props.withDragHandle,
  dragState: props.dragState,
  data: props.data,
}))

/** Only the first root node is reachable with `Tab`; the rest with the arrow keys. */
const tabindex = computed(() => (props.rootIndex === 0 ? 0 : -1))
</script>

<template>
  <li
    ref="element"
    v-bind="{ ...props.node.nodeProps, ...nodeStyles }"
    role="treeitem"
    :aria-selected="selected"
    :aria-expanded="hasChildren() ? isExpanded : undefined"
    :data-value="props.node.value"
    :data-selected="selected || undefined"
    :data-level="props.level"
    :tabindex="tabindex"
    @keydown="onKeydown"
    @blur="onBlur"
  >
    <component :is="renderLabel" v-if="props.renderNode" />
    <div v-else v-bind="elementProps">
      <component :is="renderNodeLabel" />
    </div>

    <Box
      v-if="showLoader"
      component="ul"
      role="group"
      v-bind="subtreeStyles"
      :data-level="props.level"
    >
      <li v-bind="loaderNodeStyles">
        <div v-bind="props.getStyles('label')">
          <Loader :size="16" :style="{ marginInlineStart: '4px' }" />
        </div>
      </li>
    </Box>

    <Box
      v-if="showSubtree"
      component="ul"
      role="group"
      v-bind="subtreeStyles"
      :data-level="props.level"
      :style="subtreeStyle"
    >
      <TreeNode
        v-for="child in nestedNodes"
        :key="child.value"
        v-bind="childProps"
        :node="child"
        :root-index="undefined"
        :level="props.level + 1"
        :is-subtree="true"
      />
    </Box>
  </li>
</template>
