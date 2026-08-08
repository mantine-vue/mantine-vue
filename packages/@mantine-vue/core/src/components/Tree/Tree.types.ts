import type { Component, VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'
import type { TreeAllowDrop, TreeDragHandleProps } from './use-tree-node-drag-drop'
import type { TreeController } from './use-tree'

export interface TreeNodeData {
  /** Content rendered as the node label. */
  label: VNodeChild | (() => VNodeChild)

  /** Value of the node. Must be unique across the whole tree. */
  value: string

  /** Props passed down to the node element. */
  nodeProps?: Record<string, any>

  /** Child nodes. */
  children?: TreeNodeData[]

  /** Marks the node as expandable before its children have been loaded. */
  hasChildren?: boolean
}

/** Payload passed to `renderNode` and to the `node` slot. */
export interface RenderTreeNodePayload {
  /** Depth of the node, starting at 1 for the root nodes. */
  level: number

  /** Expanded state of the node. */
  expanded: boolean

  /** Whether the node has children, including children that have not loaded yet. */
  hasChildren: boolean

  /** Selected state of the node. */
  selected: boolean

  /** Whether the node is one of the root nodes. */
  isRoot: boolean

  /** Whether the children of the node are currently loading. */
  isLoading: boolean

  /** Error thrown while the children of the node were loading. */
  loadError: Error | null

  /** Data of the node. */
  node: TreeNodeData

  /** Controller of the tree the node belongs to. */
  tree: TreeController

  /** Props that must be spread onto the element rendered for the node. */
  elementProps: Record<string, any>

  /** Props for the drag handle. Only set when `withDragHandle` is set. */
  dragHandleProps: TreeDragHandleProps | undefined
}

export type RenderNode = (payload: RenderTreeNodePayload) => VNodeChild

export type TreeStylesNames = 'root' | 'node' | 'subtree' | 'label'

export type TreeCssVariables = { root: '--level-offset' }

/** Drag and drop state shared with every node of the tree. */
export interface TreeDragState {
  /** Value of the node currently being dragged. */
  draggedValue: string | null

  /** Element the dragged node is currently hovering over. */
  currentDropTarget: HTMLElement | null
}

export type TreeFactory = any

export interface TreeSlots {
  /** Unused – nodes are generated from `data`. */
  default?: () => VNodeChild

  /** Custom markup for a node. Alias of `renderNode`. */
  node?: (payload: RenderTreeNodePayload) => VNodeChild

  /** Custom markup for a node. Takes precedence over the `node` slot. */
  renderNode?: (payload: RenderTreeNodePayload) => VNodeChild
}

/** Props declared by `Tree` itself. See `TreeProps` for the full public type. */
export interface TreeOwnProps extends StylesApiProps<TreeProps> {
  /**
   * Element or component rendered as the root.
   *
   * @default 'ul'
   */
  component?: string | Component

  /** Data used to render the nodes. */
  data: TreeNodeData[]

  /**
   * Key of `theme.spacing` or any valid CSS value used to indent each level.
   *
   * @default 'lg'
   */
  levelOffset?: string | number

  /**
   * If set, a node expands and collapses when it is clicked.
   *
   * @default true
   */
  expandOnClick?: boolean

  /**
   * If set, the focused node expands and collapses when `Space` is pressed.
   *
   * @default true
   */
  expandOnSpace?: boolean

  /**
   * If set, the focused node is checked and unchecked when `Space` is pressed.
   *
   * @default false
   */
  checkOnSpace?: boolean

  /**
   * If set, a node is selected when it is clicked.
   *
   * @default false
   */
  selectOnClick?: boolean

  /** Controller returned by `useTree`. An internal one is created when not set. */
  tree?: TreeController

  /**
   * Custom markup for a node.
   * Can also be set with the scoped `renderNode` or `node` slot – the slot takes precedence.
   */
  renderNode?: RenderNode

  /**
   * If set, the selection is cleared when a click lands outside the tree.
   *
   * @default false
   */
  clearSelectionOnOutsideClick?: boolean

  /**
   * If set, a range of nodes can be selected by holding `Shift`.
   *
   * @default true
   */
  allowRangeSelection?: boolean

  /**
   * If set, the children of collapsed nodes stay mounted.
   *
   * @default false
   */
  keepMounted?: boolean

  /** Decides whether a node may be dropped at a given position. */
  allowDrop?: TreeAllowDrop

  /**
   * If set, nodes are dragged with a dedicated handle instead of by the node itself.
   *
   * @default false
   */
  withDragHandle?: boolean

  /**
   * If set, lines connecting a node with its children are rendered.
   *
   * @default false
   */
  withLines?: boolean
}

export interface TreeProps extends Omit<BoxProps, keyof TreeOwnProps>, TreeOwnProps {}
