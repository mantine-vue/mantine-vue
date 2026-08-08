import { InputBase } from '../InputBase'
import NumberInputComponent, { varsResolver } from './NumberInput.vue'
import classes from './NumberInput.module.css'

export const NumberInput = Object.assign(NumberInputComponent, {
  classes: { ...InputBase.classes, ...classes },
  varsResolver,
})

export type {
  NumberInputCssVariables,
  NumberInputHandlers,
  NumberInputProps,
  NumberInputSlots,
  NumberInputStylesNames,
  NumberInputValue,
  NumberInputValueChangePayload,
} from './NumberInput.types'
