import type { VNodeChild } from 'vue'
import type { BoxProps, MantineFontSize, StylesApiProps, Factory } from '../../../core'

export type InputErrorStylesNames = 'error'

export type InputErrorCssVariables = {
  error: '--input-error-size'
}

export interface InputErrorSlots {
  /** Error message rendered below the input. */
  default?: () => VNodeChild
}

/** Props declared by `InputError` itself. See `InputErrorProps` for the full public type. */
export interface InputErrorOwnProps extends StylesApiProps<InputErrorFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type InputErrorFactory = Factory<{
  props: Omit<InputErrorProps, 'rootRef'>
  ref: HTMLParagraphElement
  slots: InputErrorSlots
  element: 'p'
  stylesNames: InputErrorStylesNames
  vars: InputErrorCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
