import type { MantineNode } from '../../core'
import type { TextareaOwnProps, TextareaSlots, TextareaStylesNames } from '../Textarea'

export type JsonInputStylesNames = TextareaStylesNames

export type JsonInputSlots = TextareaSlots

/** Props declared by `JsonInput` itself. See `JsonInputProps` for the full public type. */
export interface JsonInputOwnProps {
  /** Controlled value, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial value. */
  defaultValue?: string

  /**
   * If set, the value is formatted when the input loses focus and the JSON is valid.
   *
   * @default false
   */
  formatOnBlur?: boolean

  /** Error message displayed when the value is not valid JSON. */
  validationError?: MantineNode | boolean

  /**
   * Function used to serialize the value when formatting on blur.
   *
   * @default JSON.stringify
   */
  serialize?: typeof JSON.stringify

  /**
   * Function used to parse the value when validating and formatting.
   *
   * @default JSON.parse
   */
  deserialize?: typeof JSON.parse

  /**
   * Number of spaces used for indentation when formatting on blur.
   *
   * @default 2
   */
  indentSpaces?: number

  /**
   * If set, the value cannot be changed and is never formatted on blur.
   *
   * @default false
   */
  readOnly?: boolean

  /** Error message displayed below the input while the JSON is valid. */
  error?: MantineNode | boolean
}

/** Every prop `JsonInput` does not declare is forwarded to `Textarea`. */
export interface JsonInputProps
  extends Omit<TextareaOwnProps, keyof JsonInputOwnProps>, JsonInputOwnProps {}
