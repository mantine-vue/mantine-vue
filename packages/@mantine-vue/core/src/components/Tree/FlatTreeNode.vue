<script lang="ts">
import type { CSSProperties } from 'vue'
import type { FlatTreeLineState } from './flatten-tree-data/flatten-tree-data'
import type { RenderNode, TreeNodeData } from './Tree.types'
import type { TreeController } from './use-tree'

/**
 * Props of `FlatTreeNode`.
 *
 * Unlike `TreeNode` this component is not recursive: it renders a single row of an
 * already flattened tree, which is what makes virtualisation possible. Depth is
 * expressed with an indent and with the connector lines in `linesPath`.
 */
export interface FlatTreeNodeProps {
  /** Data of the node. */
  node: TreeNodeData

  /** Depth of the node, starting at 1. */
  level: number

  /** Value of the parent node, or `null` for a root node. */
  parent?: string | null

  /** Whether the node has children. */
  hasChildren: boolean

  /** Expanded state of the node. */
  expanded: boolean

  /** Controller of the owning tree. */
  tree: TreeController

  /**
   * If set, the node expands and collapses when it is clicked.
   *
   * @default true
   */
  expandOnClick?: boolean

  /**
   * If set, the node is selected when it is clicked.
   *
   * @default false
   */
  selectOnClick?: boolean

  /**
   * If set, the node expands and collapses when `Space` is pressed.
   *
   * @default true
   */
  expandOnSpace?: boolean

  /**
   * If set, the node is checked and unchecked when `Space` is pressed.
   *
   * @default false
   */
  checkOnSpace?: boolean

  /** Custom markup for the node. */
  renderNode?: RenderNode

  /** Inline style applied to the row, used by the virtualiser for positioning. */
  style?: CSSProperties

  /**
   * `tabindex` of the row. Only one row of the tree should be in the tab order.
   *
   * @default -1
   */
  tabIndex?: number

  /** Connector line state for each ancestor level. */
  linesPath?: FlatTreeLineState[]
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import classes from './Tree.module.css'

defineOptions({
  name: 'FlatTreeNode',
})

const props = withDefaults(defineProps<FlatTreeNodeProps>(), {
  parent: null,
  expandOnClick: true,
  selectOnClick: false,
  expandOnSpace: true,
  checkOnSpace: false,
  renderNode: undefined,
  style: undefined,
  tabIndex: -1,
  linesPath: undefined,
})

const element = ref<HTMLElement | null>(null)

/**
 * The rows are siblings in the DOM rather than nested, so moving between them is a
 * matter of walking the rendered row list.
 */
function focusSibling(offset: number) {
  const root = element.value?.closest('[data-tree-root]')

  if (!root || !element.value) {
    return
  }

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[role=treeitem]')).filter(
    (node) => node.style.display !== 'none',
  )

  nodes[nodes.indexOf(element.value) + offset]?.focus()
}

function onClick(event: MouseEvent) {
  event.stopPropagation()

  if (props.expandOnClick && props.hasChildren) {
    props.tree.toggleExpanded(props.node.value)
  }

  if (props.selectOnClick) {
    props.tree.select(props.node.value)
  }

  element.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.code === 'ArrowRight') {
    event.preventDefault()

    // Right expands a collapsed node, then moves into it once it is open.
    if (props.expanded && props.hasChildren) {
      focusSibling(1)
    } else if (props.hasChildren) {
      props.tree.expand(props.node.value)
    }
  } else if (event.code === 'ArrowLeft') {
    event.preventDefault()

    // Left collapses an open node, then moves out to the parent.
    if (props.expanded && props.hasChildren) {
      props.tree.collapse(props.node.value)
    } else if (props.parent) {
      element.value
        ?.closest('[data-tree-root]')
        ?.querySelector<HTMLElement>(`[role=treeitem][data-value="${CSS.escape(props.parent)}"]`)
        ?.focus()
    }
  } else if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
    event.preventDefault()
    focusSibling(event.code === 'ArrowDown' ? 1 : -1)
  } else if (event.code === 'Space') {
    if (props.expandOnSpace && props.hasChildren) {
      event.preventDefault()
      props.tree.toggleExpanded(props.node.value)
    }

    if (props.checkOnSpace) {
      event.preventDefault()

      if (props.tree.isNodeChecked(props.node.value)) {
        props.tree.uncheckNode(props.node.value)
      } else {
        props.tree.checkNode(props.node.value)
      }
    }
  }
}

const selected = computed(() => props.tree.selectedState.value.includes(props.node.value))

const elementProps = computed(() => ({
  class: classes.label,
  onClick,
  'data-selected': selected.value || undefined,
  'data-value': props.node.value,
}))

/** Both the custom markup and the label may be VNodes, which cannot be interpolated. */
const renderLabel = () =>
  props.renderNode?.({
    node: props.node,
    level: props.level,
    selected: selected.value,
    isRoot: props.level === 1,
    tree: props.tree,
    expanded: props.expanded,
    hasChildren: props.hasChildren,
    isLoading: props.tree.isNodeLoading(props.node.value),
    loadError: props.tree.getNodeLoadError(props.node.value),
    elementProps: elementProps.value,
    // Drag and drop is not supported by the flat renderer.
    dragHandleProps: undefined,
  })

const renderNodeLabel = () =>
  typeof props.node.label === 'function' ? props.node.label() : props.node.label

/** A `none` level has no line, but still occupies a grid column. */
const lines = computed(() =>
  (props.linesPath ?? []).flatMap((state, index) => (state === 'none' ? [] : [{ index, state }])),
)

const rowStyle = computed(() => [
  {
    '--label-offset': `calc(var(--level-offset, var(--mantine-spacing-lg)) * ${props.level - 1})`,
  },
  props.style,
])
</script>

<template>
  <div
    ref="element"
    v-bind="props.node.nodeProps"
    :class="classes.node"
    :style="rowStyle"
    role="treeitem"
    :aria-selected="selected"
    :aria-expanded="props.hasChildren ? props.expanded : undefined"
    :data-value="props.node.value"
    :data-selected="selected || undefined"
    :data-level="props.level"
    :tabindex="props.tabIndex"
    @keydown="onKeydown"
  >
    <span
      v-for="line in lines"
      :key="line.index"
      aria-hidden="true"
      :class="[classes.flatLine, line.state === 'closing' && classes.flatLineClosing]"
      :style="{ '--flat-line-column': line.index + 2 }"
    />

    <component :is="renderLabel" v-if="props.renderNode" />
    <div v-else v-bind="elementProps">
      <component :is="renderNodeLabel" />
    </div>
  </div>
</template>
