import { InputBase } from '../InputBase'
import TextInputComponent from './TextInput.vue'

export const TextInput = Object.assign(TextInputComponent, { classes: InputBase.classes })

export type {
  TextInputOwnProps,
  TextInputProps,
  TextInputSlots,
  TextInputStylesNames,
} from './TextInput.types'
