import type { Component, VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineRadius, MantineSize, StylesApiProps } from '../../core'

export type PasswordInputStylesNames =
  | 'root'
  | 'visibilityToggle'
  | 'innerInput'
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

export type PasswordInputCssVariables = {
  root: '--psi-icon-size' | '--psi-button-size'
}

export interface PasswordInputToggleIconSlotProps {
  /** Whether the password is currently visible. */
  reveal: boolean
}

export interface PasswordInputSlots {
  /** Input label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the input. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side, replacing the visibility toggle. */
  rightSection?: () => VNodeChild

  /** Icon of the visibility toggle. Receives the current `reveal` state. */
  visibilityToggleIcon?: (props: PasswordInputToggleIconSlotProps) => VNodeChild
}

/**
 * Props declared by `PasswordInput` itself.
 * See `PasswordInputProps` for the full public type.
 *
 * The Styles API payload is left open because the resolved props are forwarded to
 * `Input` and `Input.Wrapper` as `__stylesApiProps`.
 */
export interface PasswordInputOwnProps extends StylesApiProps {
  /** Controlled value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial value. */
  defaultValue?: string

  /**
   * Component rendered as the visibility toggle icon. Receives `reveal`.
   * Can also be set with the `visibilityToggleIcon` slot – the slot takes precedence.
   */
  visibilityToggleIcon?: Component

  /** Props passed down to the visibility toggle `ActionIcon`. */
  visibilityToggleButtonProps?: Record<string, any>

  /** Controlled visibility state of the password. Bound with `v-model:visible`. */
  visible?: boolean

  /** Uncontrolled initial visibility state. */
  defaultVisible?: boolean

  /**
   * Input label.
   * Can also be set with the `label` slot – the slot takes precedence over the prop.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence over the prop.
   */
  description?: MantineNode

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence over the prop.
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

  /** Function that renders the input around the given children. */
  inputContainer?: (children: any) => any

  /**
   * Order of the elements inside the wrapper.
   *
   * @default ['label', 'description', 'input', 'error']
   */
  inputWrapperOrder?: Array<'label' | 'input' | 'description' | 'error'>

  /** Props passed down to the root element (`Input.Wrapper` component). */
  wrapperProps?: Record<string, any>

  /** `id` shared by the input, label, description and error elements. Generated when not set. */
  id?: string

  /**
   * Controls input height and horizontal padding.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Controls the visual representation of the input.
   *
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'unstyled'

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Sets the `disabled` attribute on the input and the toggle.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Content rendered on the left side of the input.
   * Can also be set with the `leftSection` slot.
   */
  leftSection?: MantineNode

  /** Width of the left section. */
  leftSectionWidth?: string | number

  /** Props passed down to the left section element. */
  leftSectionProps?: Record<string, any>

  /** Sets `pointer-events` on the left section. */
  leftSectionPointerEvents?: string

  /**
   * Content rendered on the right side of the input. Replaces the visibility toggle.
   * Can also be set with the `rightSection` slot.
   */
  rightSection?: MantineNode

  /** Width of the right section. */
  rightSectionWidth?: string | number

  /** Props passed down to the right section element. */
  rightSectionProps?: Record<string, any>

  /**
   * Sets `pointer-events` on the right section.
   *
   * @default 'all'
   */
  rightSectionPointerEvents?: string

  /**
   * If set, error styles are applied to the input when `error` is set.
   *
   * @default true
   */
  withErrorStyles?: boolean
}

export interface PasswordInputProps
  extends Omit<BoxProps, keyof PasswordInputOwnProps>, PasswordInputOwnProps {}
