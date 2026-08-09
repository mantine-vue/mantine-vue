import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, MantineSize, StylesApiProps } from '../../../core'

export interface RadioGroupContextValue {
  /** Value of the currently selected radio. */
  value: string | null

  /** Called with the selected radio value, or its change event. */
  onChange: (eventOrValue: Event | string) => void

  /** Size shared with every radio that does not set its own. */
  size?: string | number

  /** `name` shared by every radio in the group, so the browser treats them as one set. */
  name?: string

  /** If set, every radio in the group is disabled. */
  disabled?: boolean
}

export interface RadioGroupSlots {
  /** `Radio` components that belong to the group. */
  default?: () => VNodeChild

  /** Group label. Takes precedence over the `label` prop. */
  label?: () => VNodeChild

  /** Description rendered below the label. Takes precedence over the `description` prop. */
  description?: () => VNodeChild

  /** Error message rendered below the group. Takes precedence over the `error` prop. */
  error?: () => VNodeChild
}

/** Props declared by `RadioGroup` itself. See `RadioGroupProps` for the full public type. */
export interface RadioGroupOwnProps extends StylesApiProps<RadioGroupProps> {
  /** Selected value, bound with `v-model`. */
  modelValue?: string | null

  /** Uncontrolled initial selected value. */
  defaultValue?: string | null

  /** Controls the size of every radio in the group that does not set its own `size`. */
  size?: MantineSize

  /** Props passed down to the `Input.Wrapper` root element. */
  wrapperProps?: Record<string, any>

  /** `name` shared by every radio in the group. Generated automatically when not set. */
  name?: string

  /**
   * If set, the selection cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /**
   * If set, every radio in the group is disabled.
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
export interface RadioGroupProps
  extends Omit<BoxProps, keyof RadioGroupOwnProps>, RadioGroupOwnProps {}
