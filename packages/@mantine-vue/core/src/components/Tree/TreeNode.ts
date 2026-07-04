import { defineComponent, h, ref, type PropType, type VNode, type VNodeChild } from 'vue'
import { Box } from '../../core'
import { Loader } from '../Loader'
import type { TreeAllowDrop } from './use-tree-node-drag-drop'
import { useTreeNodeDragDrop } from './use-tree-node-drag-drop'
import type { RenderNode, TreeDragState, TreeNodeData } from './Tree'
import type { TreeDragDropPayload } from './move-tree-node/move-tree-node'
import type { TreeController } from './use-tree'

function getValuesRange(anchor: string | null, value: string | undefined, flatValues: string[]) {
  if (!anchor || !value) return []
  const first = flatValues.indexOf(anchor)
  const second = flatValues.indexOf(value)
  if (first === -1 || second === -1) return []
  return flatValues.slice(Math.min(first, second), Math.max(first, second) + 1)
}

function visible(node: HTMLElement, root: Element) {
  for (
    let current: HTMLElement | null = node;
    current && current !== root;
    current = current.parentElement
  ) {
    if (current.style.display === 'none') return false
  }
  return true
}

export const TreeNode: ReturnType<typeof defineComponent> = defineComponent({
  name: 'TreeNode',
  props: {
    node: { type: Object as PropType<TreeNodeData>, required: true },
    getStyles: { type: Function as PropType<any>, required: true },
    rootIndex: { type: Number, default: undefined },
    controller: { type: Object as PropType<TreeController>, required: true },
    expandOnClick: { type: Boolean, default: true },
    flatValues: { type: Array as PropType<string[]>, required: true },
    isSubtree: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    renderNode: { type: Function as PropType<RenderNode>, default: undefined },
    selectOnClick: { type: Boolean, default: false },
    allowRangeSelection: { type: Boolean, default: true },
    expandOnSpace: { type: Boolean, default: true },
    checkOnSpace: { type: Boolean, default: false },
    keepMounted: { type: Boolean, default: false },
    onDragDrop: {
      type: Function as PropType<(payload: TreeDragDropPayload) => void>,
      default: undefined,
    },
    allowDrop: { type: Function as PropType<TreeAllowDrop>, default: undefined },
    withDragHandle: { type: Boolean, default: false },
    dragState: { type: Object as PropType<{ value: TreeDragState }>, required: true },
    data: { type: Array as PropType<TreeNodeData[]>, required: true },
  },
  setup(props) {
    const element = ref<HTMLElement | null>(null)
    const hasChildren = () =>
      Array.isArray(props.node.children) ||
      (!!props.node.hasChildren && !Array.isArray(props.node.children))
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

    const onKeydown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        event.stopPropagation()
        event.preventDefault()
        if (expanded()) element.value?.querySelector<HTMLElement>('[role=treeitem]')?.focus()
        else if (hasChildren()) props.controller.expand(props.node.value)
      } else if (event.code === 'ArrowLeft') {
        event.stopPropagation()
        event.preventDefault()
        if (expanded() && hasChildren()) props.controller.collapse(props.node.value)
        else if (props.isSubtree)
          element.value?.parentElement?.closest<HTMLElement>('[role=treeitem]')?.focus()
      } else if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        const root = element.value?.closest('[data-tree-root]')
        if (!root || !element.value) return
        event.stopPropagation()
        event.preventDefault()
        const nodes = Array.from(root.querySelectorAll<HTMLElement>('[role=treeitem]')).filter(
          (node) => visible(node, root),
        )
        const index = nodes.indexOf(element.value)
        const next = nodes[event.code === 'ArrowDown' ? index + 1 : index - 1]
        next?.focus()
        if (event.shiftKey && next)
          props.controller.setSelectedState(
            getValuesRange(props.controller.anchorNode.value, next.dataset.value, props.flatValues),
          )
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
          } else props.controller.checkNode(props.node.value)
        }
      }
    }

    return (): VNodeChild => {
      const selected = props.controller.selectedState.value.includes(props.node.value)
      const isExpanded = expanded()
      const nested: VNode[] = (props.node.children || []).map((node) =>
        h(TreeNode as any, {
          ...props,
          key: node.value,
          node,
          rootIndex: undefined,
          level: props.level + 1,
          isSubtree: true,
        }),
      )
      const onClick = (event: MouseEvent) => {
        event.stopPropagation()
        if (props.allowRangeSelection && event.shiftKey && props.controller.anchorNode.value) {
          props.controller.setSelectedState(
            getValuesRange(props.controller.anchorNode.value, props.node.value, props.flatValues),
          )
        } else {
          if (props.expandOnClick && hasChildren())
            props.controller.toggleExpanded(props.node.value)
          if (props.selectOnClick) props.controller.select(props.node.value)
        }
        element.value?.focus()
      }
      const elementProps = {
        ...props.getStyles('label'),
        ...dnd.getElementProps(),
        onClick,
        'data-selected': selected || undefined,
        'data-value': props.node.value,
      }
      const payload = {
        node: props.node,
        level: props.level,
        selected,
        isRoot: props.level === 1,
        tree: props.controller,
        expanded: isExpanded,
        hasChildren: hasChildren(),
        isLoading: props.controller.isNodeLoading(props.node.value),
        loadError: props.controller.getNodeLoadError(props.node.value),
        elementProps,
        dragHandleProps: dnd.dragHandleProps,
      }
      const label = props.renderNode
        ? props.renderNode(payload)
        : h('div', elementProps, [
            typeof props.node.label === 'function' ? props.node.label() : props.node.label,
          ] as any)
      const loading: VNode | null =
        isExpanded && payload.isLoading && nested.length === 0
          ? h(
              Box,
              {
                component: 'ul',
                role: 'group',
                ...props.getStyles('subtree'),
                'data-level': props.level,
              },
              () =>
                h(
                  'li',
                  props.getStyles('node', {
                    style: { '--label-offset': `calc(var(--level-offset) * ${props.level})` },
                  }),
                  [
                    h('div', props.getStyles('label'), [
                      h(Loader, { size: 16, style: { marginInlineStart: '4px' } }),
                    ]),
                  ],
                ),
            )
          : null
      const subtree =
        nested.length > 0 && (isExpanded || props.keepMounted)
          ? h(
              Box,
              {
                component: 'ul',
                role: 'group',
                ...props.getStyles('subtree'),
                'data-level': props.level,
                style: [props.getStyles('subtree').style, !isExpanded ? { display: 'none' } : null],
              },
              () => nested,
            )
          : null

      return h(
        'li',
        {
          ...props.node.nodeProps,
          ...props.getStyles('node', {
            style: { '--label-offset': `calc(var(--level-offset) * ${props.level - 1})` },
          }),
          role: 'treeitem',
          'aria-selected': selected,
          'aria-expanded': hasChildren() ? isExpanded : undefined,
          'data-value': props.node.value,
          'data-selected': selected || undefined,
          'data-level': props.level,
          tabindex: props.rootIndex === 0 ? 0 : -1,
          onKeydown,
          ref: element,
        },
        [label as any, loading, subtree],
      )
    }
  },
})
