import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

/** Props declared by `ButtonGroup` itself. See `ButtonGroupProps` for the full public type. */
export interface ButtonGroupOwnProps extends StylesApiProps<ButtonGroupProps> {
  /**
   * Orientation of the group
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * `border-width` of the child `Button` components. Numbers are converted to rem.
   *
   * @default 1
   */
  borderWidth?: string | number
}

export interface ButtonGroupProps
  extends Omit<BoxProps, keyof ButtonGroupOwnProps>, ButtonGroupOwnProps {}

export interface ButtonGroupSlots {
  /** Grouped buttons. */
  default?: () => VNodeChild
}
