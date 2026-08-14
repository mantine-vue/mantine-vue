import { factory } from '../../../core'
import InputErrorComponent, { varsResolver } from './InputError.vue'
import type { InputErrorFactory } from './InputError.types'
import classes from '../Input.module.css'

export const InputError = factory<InputErrorFactory>(InputErrorComponent, {
  classes,
  varsResolver,
})

export type {
  InputErrorCssVariables,
  InputErrorOwnProps,
  InputErrorProps,
  InputErrorSlots,
  InputErrorStylesNames,
  InputErrorFactory,
} from './InputError.types'
