import { InputBase } from '../InputBase'
import JsonInputComponent from './JsonInput.vue'

export const JsonInput = Object.assign(JsonInputComponent, { classes: InputBase.classes })

export type {
  JsonInputOwnProps,
  JsonInputProps,
  JsonInputSlots,
  JsonInputStylesNames,
} from './JsonInput.types'
