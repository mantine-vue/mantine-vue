import type { VNodeChild } from 'vue'
import type { BoxMod, MantineNode, MantineRadius, MantineSize, StylesApiProps } from '../../core'
import type { InputBaseOwnProps, InputBaseStylesNames } from '../InputBase'

export type PillsInputStylesNames = InputBaseStylesNames

export interface PillsInputSlots {
  /** Pills and the `PillsInput.Field`. */
  default?: () => VNodeChild

  /** Input label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the input. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side of the input. */
  rightSection?: () => VNodeChild
}

/** Props declared by `PillsInput` itself. See `PillsInputProps` for the full public type. */
export interface PillsInputOwnProps extends StylesApiProps {
  /**
   * Controls input height and horizontal padding.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * If set, the input and every pill inside it are disabled.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence over the prop.
   */
  error?: MantineNode | boolean

  /**
   * Controls the visual representation of the input.
   *
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'unstyled'

  /**
   * Static selector used as the base of the generated class names.
   *
   * @default 'PillsInput'
   */
  __staticSelector?: string

  /** Props object passed to the Styles API callbacks instead of the resolved props. */
  __stylesApiProps?: Record<string, any>

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

  /** Props passed down to the root element (`Input.Wrapper` component). */
  wrapperProps?: Record<string, any>

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

/** Every prop `PillsInput` does not declare is forwarded to `InputBase`. */
export interface PillsInputProps
  extends
    Omit<InputBaseOwnProps, keyof PillsInputOwnProps | 'component' | 'multiline' | 'withAria'>,
    PillsInputOwnProps {}
