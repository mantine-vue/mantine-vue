import type { VNodeChild } from 'vue'
import type { ClassNames, MantineNode, MantineSize, Styles, Vars } from '../../core'
import type { ThousandsGroupStyle } from '../NumberFormatter'

export interface NumberInputHandlers {
  /** Increases the value by one step. */
  increment: () => void

  /** Decreases the value by one step. */
  decrement: () => void
}

/**
 * `bigint` is supported for values beyond `Number.MAX_SAFE_INTEGER`; `string` carries
 * the intermediate states a number cannot express, such as `-` or `1.`.
 */
export type NumberInputValue = number | string | bigint

export type NumberInputStylesNames =
  | 'controls'
  | 'control'
  | 'input'
  | 'wrapper'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'

export type NumberInputCssVariables = {
  root: '--ni-chevron-size'
}

export interface NumberInputSlots {
  /** Input label. */
  label?: () => VNodeChild

  /** Description rendered below the label. */
  description?: () => VNodeChild

  /** Error message rendered below the input. */
  error?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side of the input, replacing the step controls. */
  rightSection?: () => VNodeChild
}

/** Payload passed to `onValueChange`. */
export interface NumberInputValueChangePayload {
  /** Parsed numeric value, `undefined` when the input does not hold a number. */
  floatValue?: number

  /** Value as it is displayed, including the separators, prefix and suffix. */
  formattedValue: string

  /** Value without any formatting. */
  value: string
}

/**
 * Props declared by `NumberInput` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface NumberInputProps {
  /** Value, bound with `v-model`. */
  modelValue?: NumberInputValue

  /** Uncontrolled initial value. */
  defaultValue?: NumberInputValue

  /**
   * If set, leading zeros are kept as typed.
   *
   * @default true
   */
  allowLeadingZeros?: boolean

  /**
   * If set, negative values can be entered.
   *
   * @default true
   */
  allowNegative?: boolean

  /**
   * Characters accepted as a decimal separator while typing. Each is normalised to
   * `decimalSeparator`.
   *
   * @default ['.', ',']
   */
  allowedDecimalSeparators?: string[]

  /** Maximum number of decimal places. Unlimited when not set. */
  decimalScale?: number

  /**
   * Character used as the decimal separator.
   *
   * @default '.'
   */
  decimalSeparator?: string

  /**
   * If set, the value is always padded to `decimalScale` decimal places.
   *
   * @default false
   */
  fixedDecimalScale?: boolean

  /** Text rendered before the value. */
  prefix?: string

  /** Text rendered after the value. */
  suffix?: string

  /**
   * Grouping style used for the thousands separator.
   *
   * @default 'thousand'
   */
  thousandsGroupStyle?: ThousandsGroupStyle

  /** Character used as the thousands separator. `true` uses a comma. */
  thousandSeparator?: string | boolean

  /** Minimum value. */
  min?: number | bigint

  /** Maximum value. */
  max?: number | bigint

  /**
   * Amount the value changes by with each step.
   *
   * @default 1
   */
  step?: number | bigint

  /**
   * If set, the increment and decrement controls are not rendered.
   *
   * @default false
   */
  hideControls?: boolean

  /**
   * When the value is clamped to `min`/`max`. `strict` rejects out-of-range input as it
   * is typed, `blur` corrects it when the input loses focus, `none` never clamps.
   *
   * @default 'blur'
   */
  clampBehavior?: 'strict' | 'blur' | 'none'

  /**
   * If set, decimal values can be entered.
   *
   * @default true
   */
  allowDecimal?: boolean

  /** Ref assigned the increment and decrement handlers, for stepping from the outside. */
  handlersRef?: any

  /** Delay in ms before a held step control starts repeating. */
  stepHoldDelay?: number

  /**
   * Interval in ms between repeats while a step control is held. A function receives the
   * repeat count, which allows the step to accelerate.
   */
  stepHoldInterval?: number | ((t: number) => number)

  /**
   * Value the first step starts from when the input is empty.
   *
   * @default 0
   */
  startValue?: number | bigint

  /**
   * If set, the arrow keys step the value.
   *
   * @default true
   */
  withKeyboardEvents?: boolean

  /**
   * If set, leading zeros are removed when the input loses focus.
   *
   * @default true
   */
  trimLeadingZeroesOnBlur?: boolean

  /**
   * If set, the value is selected when the input receives focus.
   *
   * @default false
   */
  selectAllOnFocus?: boolean

  /**
   * Controls the size of the input.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Sets the `disabled` attribute on the input.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the value cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /** Content rendered on the right side of the input, replacing the step controls. */
  rightSection?: MantineNode

  /** Width of the right section. Sized for the step controls when not set. */
  rightSectionWidth?: string | number

  /** `pointer-events` of the right section. */
  rightSectionPointerEvents?: string

  /**
   * Input label.
   * Can also be set with the `label` slot.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot.
   */
  description?: MantineNode

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot.
   */
  error?: MantineNode | boolean

  /**
   * If set, the input is marked required and the asterisk is shown.
   *
   * @default false
   */
  required?: boolean

  /** If set, the asterisk is shown without setting the `required` attribute. */
  withAsterisk?: boolean

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /** `classNames` of the Styles API. */
  classNames?: ClassNames

  /** `styles` of the Styles API. */
  styles?: Styles

  /** CSS variables of the Styles API. */
  vars?: Vars

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}
