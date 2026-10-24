import type { HTMLAttributes, VNodeChild } from 'vue'
import type {
  BoxProps,
  DataAttributes,
  MantineFontSize,
  StylesApiProps,
  Factory,
} from '../../../core'

export type InputDescriptionStylesNames = 'description'

export type InputDescriptionCssVariables = {
  description: '--input-description-size'
}

export interface InputDescriptionSlots {
  /** Description rendered below the label. */
  default?: () => VNodeChild
}

/** Props declared by `InputDescription` itself. See `InputDescriptionProps` for the full public type. */
export interface InputDescriptionOwnProps extends StylesApiProps<InputDescriptionFactory> {
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
  extends
    Omit<BoxProps & HTMLAttributes & DataAttributes, keyof InputDescriptionOwnProps>,
    InputDescriptionOwnProps {}

export type InputDescriptionFactory = Factory<{
  props: InputDescriptionProps
  ref: HTMLParagraphElement
  slots: InputDescriptionSlots
  element: 'p'
  stylesNames: InputDescriptionStylesNames
  vars: InputDescriptionCssVariables
}>
