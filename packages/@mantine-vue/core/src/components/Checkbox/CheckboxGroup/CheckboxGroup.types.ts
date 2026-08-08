import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineSize, StylesApiProps } from '../../../core'

export interface CheckboxGroupContextValue {
  /** Values of the currently selected checkboxes. */
  value: string[]

  /** Called with the changed checkbox value, or its change event. */
  onChange: (eventOrValue: Event | string) => void

  /** Size shared with every checkbox that does not set its own. */
  size?: string | number

  /** Reports whether a given checkbox value must be disabled. */
  isDisabled?: (value: string) => boolean
}

export interface CheckboxGroupSlots {
  /** `Checkbox` components that belong to the group. */
  default?: () => VNodeChild

  /** Group label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the group. Takes precedence over the `error` prop. */
  error?: () => VNodeChild
}

/** Props declared by `CheckboxGroup` itself. See `CheckboxGroupProps` for the full public type. */
export interface CheckboxGroupOwnProps extends StylesApiProps<CheckboxGroupProps> {
  /** Selected values, bound with `v-model`. */
  modelValue?: string[]

  /** Uncontrolled initial selected values. */
  defaultValue?: string[]

  /** Controls the size of every checkbox in the group that does not set its own `size`. */
  size?: MantineSize | (string & {})

  /** Props passed down to the `Input.Wrapper` root element. */
  wrapperProps?: Record<string, any>

  /**
   * If set, the selection cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /** `name` of the hidden input that carries the joined values in an uncontrolled form. */
  name?: string

  /** Props passed down to the hidden input. */
  hiddenInputProps?: Record<string, any>

  /**
   * Separator used to join the values in the hidden input.
   *
   * @default ','
   */
  hiddenInputValuesSeparator?: string

  /** Maximum number of values that can be selected at once. */
  maxSelectedValues?: number

  /**
   * If set, every checkbox in the group is disabled.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Group label.
   * Can also be set with the `label` slot – the slot takes precedence over the prop.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence over the prop.
   */
  description?: MantineNode

  /**
   * Error message rendered below the group. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence over the prop.
   */
  error?: MantineNode | boolean
}

/**
 * Attributes not declared here fall through to `Input.Wrapper`, so its props are
 * accepted as well.
 */
export interface CheckboxGroupProps
  extends Omit<BoxProps, keyof CheckboxGroupOwnProps>, CheckboxGroupOwnProps {}
