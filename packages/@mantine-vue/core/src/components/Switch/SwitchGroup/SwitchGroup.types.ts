import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineSize, StylesApiProps } from '../../../core'

export interface SwitchGroupContextValue {
  /** Values of the currently selected switches. */
  value: string[]

  /** Called with the changed switch value, or its change event. */
  onChange: (eventOrValue: Event | string) => void

  /** Size shared with every switch that does not set its own. */
  size?: string | number

  /** Reports whether a given switch value must be disabled. */
  isDisabled?: (value: string) => boolean
}

export interface SwitchGroupSlots {
  /** `Switch` components that belong to the group. */
  default?: () => VNodeChild

  /** Group label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the group. Takes precedence over the `error` prop. */
  error?: () => VNodeChild
}

/** Props declared by `SwitchGroup` itself. See `SwitchGroupProps` for the full public type. */
export interface SwitchGroupOwnProps extends StylesApiProps<SwitchGroupProps> {
  /** Selected values, bound with `v-model`. */
  modelValue?: string[]

  /** Uncontrolled initial selected values. */
  defaultValue?: string[]

  /** Controls the size of every switch in the group that does not set its own `size`. */
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
   * If set, every switch in the group is disabled.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Group label.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot – the slot takes precedence.
   */
  description?: MantineNode

  /**
   * Error message rendered below the group. `true` applies error styles without a message.
   * Can also be set with the `error` slot – the slot takes precedence.
   */
  error?: MantineNode | boolean
}

/**
 * Attributes not declared here fall through to `Input.Wrapper`, so its props are
 * accepted as well.
 */
export interface SwitchGroupProps
  extends Omit<BoxProps, keyof SwitchGroupOwnProps>, SwitchGroupOwnProps {}
