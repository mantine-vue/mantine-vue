import type { VueRefTarget } from '@mantine-vue/hooks'
import type {
  BoxProps,
  MantineRadius,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
} from '../../core'

export type PinInputStylesNames = 'root' | 'pinInput' | 'input'
export type PinInputCssVariables = {
  root: '--pin-input-size'
}
export type PinInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | (string & {})
export type PinInputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search'

/** Props declared by `PinInput` itself. See `PinInputProps` for the full public type. */
export interface PinInputOwnProps extends StylesApiProps<PinInputProps> {
  /** `name` of the hidden input, used when the input is part of a form. */
  name?: string

  /** `form` of the hidden input. */
  form?: string

  /**
   * Key of `theme.spacing` or any valid CSS value to set the gap between the fields.
   *
   * @default 'sm'
   */
  gap?: MantineSpacing

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: MantineRadius

  /**
   * Controls the size of the fields.
   *
   * @default 'sm'
   */
  size?: MantineSize

  /**
   * If set, the first field is focused on mount.
   *
   * @default false
   */
  autoFocus?: boolean

  /** Entered code, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial code. */
  defaultValue?: string

  /**
   * Placeholder of an empty field.
   *
   * @default '\u25cb'
   */
  placeholder?: string

  /**
   * If set, focus moves to the next field as characters are entered.
   *
   * @default true
   */
  manageFocus?: boolean

  /**
   * If set, the fields advertise themselves as one-time-code inputs so the browser can
   * offer an SMS code.
   *
   * @default true
   */
  oneTimeCode?: boolean

  /** Base `id` of the fields. Generated automatically when not set. */
  id?: string

  /**
   * Sets the `disabled` attribute on every field.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, error styles are applied to every field.
   *
   * @default false
   */
  error?: boolean

  /**
   * Characters the fields accept. A `RegExp` is tested against the entered value.
   *
   * @default 'alphanumeric'
   */
  type?: 'alphanumeric' | 'number' | RegExp

  /**
   * If set, the entered characters are masked.
   *
   * @default false
   */
  mask?: boolean

  /**
   * Number of fields.
   *
   * @default 4
   */
  length?: number

  /**
   * If set, the code cannot be changed by the user.
   *
   * @default false
   */
  readOnly?: boolean

  /** `type` attribute of the fields. Derived from `mask` and `type` when not set. */
  inputType?: PinInputTypeAttribute

  /** `inputmode` attribute of the fields. Derived from `type` when not set. */
  inputMode?: PinInputMode

  /**
   * `aria-label` of each field.
   *
   * @default 'PinInput'
   */
  ariaLabel?: string

  /** Props passed down to the hidden input that carries the code in a form. */
  hiddenInputProps?: Record<string, any>

  /** Ref assigned to the root element. */
  rootRef?: VueRefTarget<HTMLDivElement>

  /** Ref assigned to the first field. */
  inputRef?: VueRefTarget<HTMLInputElement>

  /** Returns extra props for the field at the given index. */
  getInputProps?: (index: number) => Record<string, any>

  /** Controls the visual representation of the fields. */
  variant?: string
}

export interface PinInputProps extends Omit<BoxProps, keyof PinInputOwnProps>, PinInputOwnProps {}
