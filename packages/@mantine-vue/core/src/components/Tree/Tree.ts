import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  useStyles,
  type BoxProps,
} from '../../core'
import type { TreeDragDropPayload } from './move-tree-node/move-tree-node'
import { TreeNode } from './TreeNode'
import type { TreeAllowDrop, TreeDragHandleProps } from './use-tree-node-drag-drop'
import { useTree, type TreeController } from './use-tree'
import classes from './Tree.module.css'

export interface TreeNodeData {
  label: VNodeChild | (() => VNodeChild)
  value: string
  nodeProps?: Record<string, any>
  children?: TreeNodeData[]
  hasChildren?: boolean
}
export interface RenderTreeNodePayload {
  level: number
  expanded: boolean
  hasChildren: boolean
  selected: boolean
  isRoot: boolean
  isLoading: boolean
  loadError: Error | null
  node: TreeNodeData
  tree: TreeController
  elementProps: Record<string, any>
  dragHandleProps: TreeDragHandleProps | undefined
}
export type RenderNode = (payload: RenderTreeNodePayload) => VNodeChild
export type TreeStylesNames = 'root' | 'node' | 'subtree' | 'label'
export type TreeCssVariables = { root: '--level-offset' }
export interface TreeDragState {
  draggedValue: string | null
  currentDropTarget: HTMLElement | null
}
export interface TreeProps extends BoxProps {
  data: TreeNodeData[]
  levelOffset?: string | number
  expandOnClick?: boolean
  expandOnSpace?: boolean
  checkOnSpace?: boolean
  selectOnClick?: boolean
  tree?: TreeController
  renderNode?: RenderNode
  clearSelectionOnOutsideClick?: boolean
  allowRangeSelection?: boolean
  keepMounted?: boolean
  onDragDrop?: (payload: TreeDragDropPayload) => void
  allowDrop?: TreeAllowDrop
  withDragHandle?: boolean
  withLines?: boolean
}
export type TreeFactory = any

function getFlatValues(data: TreeNodeData[]): string[] {
  return data.flatMap((node) => [
    node.value,
    ...(node.children ? getFlatValues(node.children) : []),
  ])
}

const varsResolver = createVarsResolver<any>((_, { levelOffset }) => ({
  root: { '--level-offset': getSpacing(levelOffset) },
}))

export const Tree = withBoxProps(
  defineComponent({
    name: 'Tree',
    inheritAttrs: false,
    props: {
      component: {
        type: [String, Object, Function] as PropType<string | Component>,
        default: 'ul',
      },
      data: { type: Array as PropType<TreeNodeData[]>, required: true },
      levelOffset: { type: [String, Number] as PropType<string | number>, default: 'lg' },
      expandOnClick: { type: Boolean, default: true },
      expandOnSpace: { type: Boolean, default: true },
      checkOnSpace: { type: Boolean, default: false },
      selectOnClick: { type: Boolean, default: false },
      tree: { type: Object as PropType<TreeController>, default: undefined },
      renderNode: { type: Function as PropType<RenderNode>, default: undefined },
      clearSelectionOnOutsideClick: { type: Boolean, default: false },
      allowRangeSelection: { type: Boolean, default: true },
      keepMounted: { type: Boolean, default: false },
      onDragDrop: {
        type: Function as PropType<(payload: TreeDragDropPayload) => void>,
        default: undefined,
      },
      allowDrop: { type: Function as PropType<TreeAllowDrop>, default: undefined },
      withDragHandle: { type: Boolean, default: false },
      withLines: { type: Boolean, default: false },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
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
      watch([() => props.data, () => props.tree], () => controller().initialize(props.data), {
        immediate: true,
      })
      const outside = (event: MouseEvent) => {
        const element = (root.value?.$el ?? root.value) as HTMLElement | null
        if (
          props.clearSelectionOnOutsideClick &&
          element &&
          !element.contains(event.target as Node)
        )
          controller().clearSelected()
      }
      onMounted(() => document.addEventListener('mousedown', outside))
      onBeforeUnmount(() => document.removeEventListener('mousedown', outside))

      return () => {
        const flatValues = getFlatValues(props.data)
        const renderNode =
          props.renderNode ||
          (slots.node ? (payload: RenderTreeNodePayload) => slots.node?.(payload) : undefined)
        const nodes = props.data.map((node, index) =>
          h(TreeNode, {
            key: node.value,
            node,
            getStyles,
            rootIndex: index,
            controller: controller(),
            flatValues,
            expandOnClick: props.expandOnClick,
            selectOnClick: props.selectOnClick,
            allowRangeSelection: props.allowRangeSelection,
            expandOnSpace: props.expandOnSpace,
            checkOnSpace: props.checkOnSpace,
            keepMounted: props.keepMounted,
            onDragDrop: props.onDragDrop,
            allowDrop: props.allowDrop,
            withDragHandle: props.withDragHandle,
            dragState: dragState as any,
            data: props.data,
            renderNode,
          }),
        )
        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            component: props.component,
            ref: root,
            role: 'tree',
            'aria-multiselectable': controller().multiple,
            'data-tree-root': '',
            'data-with-lines': props.withLines || undefined,
          },
          () => nodes,
        )
      }
    },
  }),
)

Object.assign(Tree, { classes, varsResolver })
