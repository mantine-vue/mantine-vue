import { factory } from '../../core'
import { InputBase } from '../InputBase'
import PinInputComponent, { varsResolver } from './PinInput.vue'
import type { PinInputFactory } from './PinInput.types'
import classes from './PinInput.module.css'

export const PinInput = factory<PinInputFactory>(PinInputComponent, {
  classes: { ...classes, ...InputBase.classes },
  varsResolver,
})

export type {
  PinInputCssVariables,
  PinInputEmits,
  PinInputMode,
  PinInputOwnProps,
  PinInputProps,
  PinInputStylesNames,
  PinInputTypeAttribute,
  PinInputFactory,
} from './PinInput.types'
