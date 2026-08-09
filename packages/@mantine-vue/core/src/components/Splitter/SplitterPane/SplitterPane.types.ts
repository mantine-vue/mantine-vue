import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps } from '../../../core'

export type SplitterPaneStylesNames = 'pane'

export interface SplitterPaneSlots {
  /** Pane content. */
  default?: () => VNodeChild
}

/** Props declared by `SplitterPane` itself. See `SplitterPaneProps` for the full public type. */
export interface SplitterPaneOwnProps {
  /** Size the pane starts at, as a percentage of the splitter. */
  defaultSize: number

  /** Smallest size the pane can be resized to, as a percentage. */
  min?: number

  /** Largest size the pane can be resized to, as a percentage. */
  max?: number

  /**
   * If set, the pane can be collapsed by dragging it below `collapseThreshold`.
   *
   * @default false
   */
  collapsible?: boolean

  /** Size below which a collapsible pane snaps closed, as a percentage. */
  collapseThreshold?: number

  /** Position of this pane within the splitter, assigned by the parent `Splitter`. */
  __index?: number

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod

  /** Class names applied to the compound selectors the pane renders. */
  classNames?: Partial<Record<SplitterPaneStylesNames, string>> | ((...args: any[]) => any)

  /** Inline styles applied to the compound selectors the pane renders. */
  styles?: Partial<Record<SplitterPaneStylesNames, any>> | ((...args: any[]) => any)

  /** CSS variables applied to the compound selectors the pane renders. */
  vars?: any
}

export interface SplitterPaneProps
  extends Omit<BoxProps, keyof SplitterPaneOwnProps>, SplitterPaneOwnProps {}
