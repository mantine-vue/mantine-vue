import type { LabelHTMLAttributes, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  DataAttributes,
  MantineFontSize,
  StylesApiProps,
  Factory,
} from '../../../core'

export type InputLabelStylesNames = 'label' | 'required'

export type InputLabelCssVariables = {
  label: '--input-label-size' | '--input-asterisk-color'
}

export interface InputLabelSlots {
  /** Label content. */
  default?: () => VNodeChild
}

/** Props declared by `InputLabel` itself. See `InputLabelProps` for the full public type. */
export interface InputLabelOwnProps extends StylesApiProps<InputLabelFactory> {
  /**
   * If set, the required asterisk is displayed next to the label.
   *
   * @default false
   */
  required?: boolean

  /**
   * Controls label `font-size`.
   *
   * @default 'sm'
   */
  size?: MantineFontSize | number

  /**
   * Root element of the label.
   *
   * @default 'label'
   */
  labelElement?: 'label' | 'div'

  /** Value of the `for` attribute, ignored when `labelElement` is not `label`. */
  htmlFor?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface InputLabelProps
  extends
    Omit<BoxProps & LabelHTMLAttributes & DataAttributes, keyof InputLabelOwnProps>,
    InputLabelOwnProps {}

export type InputLabelFactory = Factory<{
  props: InputLabelProps
  ref: HTMLLabelElement
  slots: InputLabelSlots
  element: 'label'
  stylesNames: InputLabelStylesNames
  vars: InputLabelCssVariables
}>
