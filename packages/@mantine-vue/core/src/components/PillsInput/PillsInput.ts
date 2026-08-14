import { factory } from '../../core'
import { InputBase } from '../InputBase'
import type { PillsInputFactory } from './PillsInput.types'
import PillsInputComponent from './PillsInput.vue'
import { PillsInputField } from './PillsInputField/PillsInputField'

export const PillsInput = factory<PillsInputFactory>(PillsInputComponent, {
  classes: InputBase.classes,
  Field: PillsInputField,
})

export type {
  PillsInputFactory,
  PillsInputOwnProps,
  PillsInputProps,
  PillsInputSlots,
  PillsInputStylesNames,
} from './PillsInput.types'
