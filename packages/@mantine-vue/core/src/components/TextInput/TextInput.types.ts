import type { InputBaseProps, InputBaseSlots, InputBaseStylesNames } from '../InputBase'

export type TextInputStylesNames = InputBaseStylesNames

export type TextInputSlots = InputBaseSlots

/** Props declared by `TextInput` itself. See `TextInputProps` for the full public type. */
export interface TextInputOwnProps {
  /** Controlled value, bound with `v-model`. */
  modelValue?: string | number

  /** Uncontrolled initial value. */
  defaultValue?: string | number
}

/** Every prop `TextInput` does not declare is forwarded to `InputBase`. */
export interface TextInputProps
  extends Omit<InputBaseProps, keyof TextInputOwnProps | 'component'>, TextInputOwnProps {}
