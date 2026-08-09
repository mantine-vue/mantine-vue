import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { BoxMod, BoxProps, StylesApiProps } from '../../core'
import type { UseSplitterRedistributeFn, UseSplitterReturnValue } from './use-splitter'

export type SplitterStylesNames = 'root' | 'handle' | 'thumb' | 'pane'

export type SplitterCssVariables = '--splitter-line-size' | '--splitter-handle-color'

export interface SplitterSlots {
  /** `Splitter.Pane` children. Resize handles are inserted between them. */
  default?: () => VNodeChild

  /** Icon rendered inside every resize handle. Alternative to the `handleIcon` prop. */
  handleIcon?: () => VNodeChild
}

/** Props declared by `Splitter` itself. See `SplitterProps` for the full public type. */
export interface SplitterOwnProps extends StylesApiProps<SplitterProps> {
  /**
   * Direction the panes are laid out in.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Sizes of the panes in percent, bound with `v-model:sizes`. The splitter is
   * uncontrolled when not set.
   */
  sizes?: number[]

  /**
   * How the space freed by a resize is distributed across the other panes. `nearest`
   * gives it to the adjacent pane, `equal` shares it between all of them.
   */
  redistribute?: 'nearest' | 'equal' | UseSplitterRedistributeFn

  /**
   * Percentage a handle moves by with each arrow key press.
   *
   * @default 1
   */
  step?: number

  /**
   * Percentage a handle moves by when an arrow key is pressed with `Shift`.
   *
   * @default 10
   */
  shiftStep?: number

  /**
   * Thickness of the line between two panes.
   *
   * @default 2
   */
  lineSize?: number | string

  /** Key of `theme.colors` or any valid CSS color used by the handle. */
  handleColor?: string

  /**
   * Icon rendered inside every resize handle.
   * Can also be set with the `handleIcon` slot – the slot takes precedence.
   */
  handleIcon?: VNodeChild

  /**
   * If set, a grip thumb is rendered in the middle of every handle.
   *
   * @default true
   */
  withHandle?: boolean

  /**
   * If set, double clicking a handle resets the adjacent panes to their default sizes.
   *
   * @default true
   */
  resetOnDoubleClick?: boolean

  /** Ref assigned the splitter controller, for driving the panes from the outside. */
  splitterRef?: VueRefTarget<UseSplitterReturnValue>

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface SplitterProps extends Omit<BoxProps, keyof SplitterOwnProps>, SplitterOwnProps {}

export interface SplitterEmits {
  /** Emitted with the next sizes whenever a handle is moved, bound with `v-model:sizes`. */
  'update:sizes': [sizes: number[]]

  /** Emitted with the next sizes whenever a handle is moved. */
  'size-change': [sizes: number[]]

  /** Emitted with the handle index when a resize starts. */
  'resize-start': [handleIndex: number]

  /** Emitted with the handle index and the final sizes when a resize ends. */
  'resize-end': [handleIndex: number, sizes: number[]]

  /** Emitted when a collapsible pane is collapsed or expanded. */
  'collapse-change': [panelIndex: number, collapsed: boolean]
}
