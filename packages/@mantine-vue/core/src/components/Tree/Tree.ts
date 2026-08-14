import { factory } from '../../core'
import TreeComponent, { varsResolver } from './Tree.vue'
import type { TreeFactory } from './Tree.types'
import classes from './Tree.module.css'

export const Tree = factory<TreeFactory>(TreeComponent, {
  classes,
  varsResolver,
})

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
