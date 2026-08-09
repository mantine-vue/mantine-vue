import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineFontSize, MantineNode, StylesApiProps } from '../../../core'
import type { InputWrapperOrderPart } from './get-input-offsets/get-input-offsets'

export type InputWrapperStylesNames = 'root' | 'label' | 'required' | 'description' | 'error'

export type InputWrapperCssVariables = {
  label: '--input-label-size' | '--input-asterisk-color'
  error: '--input-error-size'
  description: '--input-description-size'
}

export interface InputWrapperSlots {
  /** The input the wrapper labels. */
  default?: () => VNodeChild

  /** Label content. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description content. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error content. Takes precedence over the `error` prop. */
  error?: () => VNodeChild
}

/**
 * Props declared by `InputWrapper` itself. See `InputWrapperProps` for the full public type.
 *
 * The Styles API payload is deliberately left open (`StylesApiProps` without a type
 * argument). Every component built on the input family – `InputBase`, the selection
 * groups, `PasswordInput` – forwards its *own* `classNames`/`styles` callbacks down to
 * this component, and a callback typed for `CheckboxGroupProps` is not assignable to
 * one typed for `InputWrapperProps`. `Text` carries the same allowance for the same
 * reason.
 */
export interface InputWrapperOwnProps extends StylesApiProps {
  /**
   * Contents of the label element.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Contents of the description element, displayed below the label.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Contents of the error element, displayed below the input. `true` applies error
   * styles without rendering a message.
   * Can also be set with the `error` slot – the slot takes precedence.
   */
  error?: MantineNode | boolean

  /**
   * Adds the required attribute to the input and a red asterisk to the label.
   *
   * @default false
   */
  required?: boolean

  /**
   * Adds the red asterisk to the label without setting the input `required` attribute.
   * Inherits `required` when not set.
   */
  withAsterisk?: boolean

  /** Props passed down to the `Input.Label` component. */
  labelProps?: Record<string, any>

  /** Props passed down to the `Input.Description` component. */
  descriptionProps?: Record<string, any>

  /** Props passed down to the `Input.Error` component. */
  errorProps?: Record<string, any>

  /** Function that wraps the input before it is rendered in the layout. */
  inputContainer?: (children: any) => any

  /**
   * Order of the wrapper's parts.
   *
   * @default ['label', 'description', 'input', 'error']
   */
  inputWrapperOrder?: InputWrapperOrderPart[]

  /** Base `id` used to connect the label, description and error with the input. Generated when not set. */
  id?: string

  /** Controls the `font-size` of the label, description and error. */
  size?: MantineFontSize | (string & {}) | number

  /**
   * Element rendered as the label.
   *
   * @default 'label'
   */
  labelElement?: 'label' | 'div'

  /** Controls the visual representation of the wrapped input. */
  variant?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface InputWrapperProps
  extends Omit<BoxProps, keyof InputWrapperOwnProps>, InputWrapperOwnProps {}
