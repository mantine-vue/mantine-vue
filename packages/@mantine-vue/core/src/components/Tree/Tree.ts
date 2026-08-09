import { withBoxProps } from '../../core'
import TreeComponent, { varsResolver } from './Tree.vue'
import classes from './Tree.module.css'

export const Tree = withBoxProps(Object.assign(TreeComponent, { classes, varsResolver }))

export type {
  RenderNode,
  RenderTreeNodePayload,
  TreeCssVariables,
  TreeDragState,
  TreeFactory,
  TreeNodeData,
  TreeOwnProps,
  TreeProps,
  TreeSlots,
  TreeStylesNames,
} from './Tree.types'
