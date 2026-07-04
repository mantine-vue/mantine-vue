import { defineComponent, h, ref, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import type { FlatTreeLineState } from './flatten-tree-data/flatten-tree-data'
import type { RenderNode, TreeNodeData } from './Tree'
import type { TreeController } from './use-tree'
import classes from './Tree.module.css'

export interface FlatTreeNodeProps {
  node: TreeNodeData
  level: number
  parent: string | null
  hasChildren: boolean
  expanded: boolean
  tree: TreeController
  expandOnClick?: boolean
  selectOnClick?: boolean
  expandOnSpace?: boolean
  checkOnSpace?: boolean
  renderNode?: RenderNode
  style?: CSSProperties
  tabIndex?: number
  linesPath?: FlatTreeLineState[]
}

export const FlatTreeNode = defineComponent({
  name: 'FlatTreeNode',
  props: {
    node: { type: Object as PropType<TreeNodeData>, required: true },
    level: { type: Number, required: true },
    parent: { type: String as PropType<string | null>, default: null },
    hasChildren: { type: Boolean, required: true },
    expanded: { type: Boolean, required: true },
    tree: { type: Object as PropType<TreeController>, required: true },
    expandOnClick: { type: Boolean, default: true },
    selectOnClick: { type: Boolean, default: false },
    expandOnSpace: { type: Boolean, default: true },
    checkOnSpace: { type: Boolean, default: false },
    renderNode: { type: Function as PropType<RenderNode>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
    tabIndex: { type: Number, default: -1 },
    linesPath: { type: Array as PropType<FlatTreeLineState[]>, default: undefined },
  },
  setup(props) {
    const element = ref<HTMLElement | null>(null)
    const focusSibling = (offset: number) => {
      const root = element.value?.closest('[data-tree-root]')
      if (!root || !element.value) return
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('[role=treeitem]')).filter(
        (node) => node.style.display !== 'none',
      )
      nodes[nodes.indexOf(element.value) + offset]?.focus()
    }
    const onClick = (event: MouseEvent) => {
      event.stopPropagation()
      if (props.expandOnClick && props.hasChildren) props.tree.toggleExpanded(props.node.value)
      if (props.selectOnClick) props.tree.select(props.node.value)
      element.value?.focus()
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        event.preventDefault()
        if (props.expanded && props.hasChildren) focusSibling(1)
        else if (props.hasChildren) props.tree.expand(props.node.value)
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault()
        if (props.expanded && props.hasChildren) props.tree.collapse(props.node.value)
        else if (props.parent)
          element.value
            ?.closest('[data-tree-root]')
            ?.querySelector<HTMLElement>(
              `[role=treeitem][data-value="${CSS.escape(props.parent)}"]`,
            )
            ?.focus()
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
          } else props.tree.checkNode(props.node.value)
        }
      }
    }

    return (): VNodeChild => {
      const selected = props.tree.selectedState.value.includes(props.node.value)
      const elementProps = {
        class: classes.label,
        onClick,
        'data-selected': selected || undefined,
        'data-value': props.node.value,
      }
      const label = props.renderNode
        ? props.renderNode({
            node: props.node,
            level: props.level,
            selected,
            isRoot: props.level === 1,
            tree: props.tree,
            expanded: props.expanded,
            hasChildren: props.hasChildren,
            isLoading: props.tree.isNodeLoading(props.node.value),
            loadError: props.tree.getNodeLoadError(props.node.value),
            elementProps,
            dragHandleProps: undefined,
          })
        : h('div', elementProps, [
            typeof props.node.label === 'function' ? props.node.label() : props.node.label,
          ] as any)
      const lines =
        props.linesPath?.flatMap((state, index) =>
          state === 'none'
            ? []
            : [
                h('span', {
                  key: index,
                  'aria-hidden': 'true',
                  class: [classes.flatLine, state === 'closing' && classes.flatLineClosing],
                  style: { '--flat-line-column': index + 2 },
                }),
              ],
        ) ?? []
      return h(
        'div',
        {
          ...props.node.nodeProps,
          ref: element,
          class: classes.node,
          style: [
            {
              '--label-offset': `calc(var(--level-offset, var(--mantine-spacing-lg)) * ${props.level - 1})`,
            },
            props.style,
          ],
          role: 'treeitem',
          'aria-selected': selected,
          'aria-expanded': props.hasChildren ? props.expanded : undefined,
          'data-value': props.node.value,
          'data-selected': selected || undefined,
          'data-level': props.level,
          tabindex: props.tabIndex,
          onKeydown,
        },
        [...lines, label as any],
      )
    }
  },
})
