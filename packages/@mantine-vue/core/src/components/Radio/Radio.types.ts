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

export type RadioVariant = 'filled' | 'outline'

export type RadioStylesNames =
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error'
  | 'inner'
  | 'radio'
  | 'icon'

export type RadioCssVariables = {
  root:
    | '--radio-size'
    | '--radio-radius'
    | '--radio-color'
    | '--radio-icon-color'
    | '--radio-icon-size'
}

export interface RadioIconSlotProps {
  /** Class name generated for the `icon` selector. */
  class?: any

  /** Inline style generated for the `icon` selector. */
  style?: any
}

export interface RadioSlots {
  /** Radio label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the label. Takes precedence over the `error` prop. */
  error?: () => VNodeChild

  /** Radio icon. Receives the generated icon styles. */
  icon?: (props: RadioIconSlotProps) => VNodeChild
}

/** Props declared by `Radio` itself. See `RadioProps` for the full public type. */
export interface RadioOwnProps extends StylesApiProps<RadioProps> {
  /** `id` shared by the input and its label. Generated automatically when not set. */
  id?: string

  /**
   * Content of the label.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Key of `theme.colors` or any valid CSS color used for the checked state.
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls the size of the radio. Falls back to the size set on the parent
   * `Radio.Group`.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {})

  /**
   * Component rendered as the radio icon.
   * Can also be set with the scoped `icon` slot – the slot takes precedence.
   */
  icon?: Component

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /**
   * Position of the label relative to the radio.
   *
   * @default 'right'
   */
  labelPosition?: 'left' | 'right'

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Error message rendered below the label. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence.
   */
  error?: MantineNode | boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   *
   * @default 'xl'
   */
  radius?: MantineRadius

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
   * Controls the visual representation of the radio.
   *
   * @default 'filled'
   */
  variant?: RadioVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface RadioProps extends Omit<BoxProps, keyof RadioOwnProps>, RadioOwnProps {}
