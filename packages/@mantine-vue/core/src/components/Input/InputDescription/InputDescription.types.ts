import type { VNodeChild } from 'vue'
import type { BoxProps, MantineFontSize, StylesApiProps } from '../../../core'

export type InputDescriptionStylesNames = 'description'

export type InputDescriptionCssVariables = {
  description: '--input-description-size'
}

export interface InputDescriptionSlots {
  /** Description rendered below the label. */
  default?: () => VNodeChild
}

/** Props declared by `InputDescription` itself. See `InputDescriptionProps` for the full public type. */
export interface InputDescriptionOwnProps extends StylesApiProps<InputDescriptionProps> {
  /**
   * Controls description `font-size`.
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

export interface InputDescriptionProps
  extends Omit<BoxProps, keyof InputDescriptionOwnProps>, InputDescriptionOwnProps {}
