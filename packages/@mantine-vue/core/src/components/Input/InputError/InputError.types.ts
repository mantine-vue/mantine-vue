import type { VNodeChild } from 'vue'
import type { BoxProps, MantineFontSize, StylesApiProps } from '../../../core'

export type InputErrorStylesNames = 'error'

export type InputErrorCssVariables = {
  error: '--input-error-size'
}

export interface InputErrorSlots {
  /** Error message rendered below the input. */
  default?: () => VNodeChild
}

/** Props declared by `InputError` itself. See `InputErrorProps` for the full public type. */
export interface InputErrorOwnProps extends StylesApiProps<InputErrorProps> {
  /**
   * Controls error `font-size`.
   *
   * @default 'sm'
   */
  size?: MantineFontSize | number

  /**
   * If set, styles are inherited from the parent `Input.Wrapper` instead of being
   * resolved by this component.
   *
   * @default true
   */
  __inheritStyles?: boolean
}

export interface InputErrorProps
  extends Omit<BoxProps, keyof InputErrorOwnProps>, InputErrorOwnProps {}
