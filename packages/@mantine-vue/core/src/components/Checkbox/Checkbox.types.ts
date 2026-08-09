import type { Component, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineNode,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../core'

export type CheckboxVariant = 'filled' | 'outline'

export type CheckboxStylesNames =
  | 'icon'
  | 'inner'
  | 'input'
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'

export type CheckboxCssVariables = {
  root: '--checkbox-size' | '--checkbox-radius' | '--checkbox-color' | '--checkbox-icon-color'
}

export interface CheckboxIconSlotProps {
  /** Whether the checkbox is in the indeterminate state. */
  indeterminate?: boolean

  /** Class name generated for the `icon` selector. */
  class?: any

  /** Inline style generated for the `icon` selector. */
  style?: any
}

export interface CheckboxSlots {
  /** Checkbox label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the label. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Check icon. Receives the indeterminate state and the generated icon styles. */
  icon?: (props: CheckboxIconSlotProps) => VNodeChild
}

/** Props declared by `Checkbox` itself. See `CheckboxProps` for the full public type. */
export interface CheckboxOwnProps extends StylesApiProps<CheckboxProps> {
  /** `id` shared by the input and its label. Generated automatically when not set. */
  id?: string

  /**
   * Content of the label.
   * Can also be set with the `label` slot – the slot takes precedence over the prop.
   */
  label?: MantineNode

  /**
   * Key of `theme.colors` or any valid CSS color used for the checked state.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls the size of the checkbox. Falls back to the size set on the parent
   * `Checkbox.Group`.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {})

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default 'sm'
   */
  radius?: MantineRadius

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /**
   * Position of the label relative to the checkbox.
   *
   * @default 'right'
   */
  labelPosition?: 'left' | 'right'

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence over the prop.
   */
  description?: MantineNode

  /**
   * Error message rendered below the label. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence over the prop.
   */
  error?: MantineNode | boolean

  /**
   * If set, the indeterminate icon is displayed and the checked state is ignored.
   *
   * @default false
   */
  indeterminate?: boolean

  /**
   * Component rendered as the check icon.
   * Can also be set with the scoped `icon` slot – the slot takes precedence.
   */
  icon?: Component

  /** Ref assigned to the root element. */
  rootRef?: any

  /** Key of `theme.colors` or any valid CSS color used for the icon. */
  iconColor?: MantineColor

  /**
   * If set, adjusts the icon color based on the background color.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * If set, error styles are applied to the input when `error` is set.
   *
   * @default true
   */
  withErrorStyles?: boolean

  /** Checked state, bound with `v-model`. */
  modelValue?: boolean

  /** Checked state, bound with `v-model:checked`. */
  checked?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the checked state cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /**
   * Controls the visual representation of the checkbox.
   *
   * @default 'filled'
   */
  variant?: CheckboxVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface CheckboxProps extends Omit<BoxProps, keyof CheckboxOwnProps>, CheckboxOwnProps {}
