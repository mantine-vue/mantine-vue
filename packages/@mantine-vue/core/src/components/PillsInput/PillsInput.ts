import { InputBase } from '../InputBase'
import PillsInputComponent from './PillsInput.vue'
import { PillsInputField } from './PillsInputField/PillsInputField'

export const PillsInput = Object.assign(PillsInputComponent, {
  classes: InputBase.classes,
  Field: PillsInputField,
})

export type {
  PillsInputOwnProps,
  PillsInputProps,
  PillsInputSlots,
  PillsInputStylesNames,
} from './PillsInput.types'
