import { factory } from '../../core'
import { InputBase } from '../InputBase'
import type { NumberInputFactory } from './NumberInput.types'
import NumberInputComponent, { varsResolver } from './NumberInput.vue'
import classes from './NumberInput.module.css'

export const NumberInput = factory<NumberInputFactory>(NumberInputComponent, {
  classes: { ...InputBase.classes, ...classes },
  varsResolver,
})

export type {
  NumberInputCssVariables,
  NumberInputEmits,
  NumberInputFactory,
  NumberInputHandlers,
  NumberInputProps,
  NumberInputSlots,
  NumberInputStylesNames,
  NumberInputValue,
  NumberInputValueChangePayload,
} from './NumberInput.types'
