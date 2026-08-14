import { factory } from '../../../core'
import InputLabelComponent, { varsResolver } from './InputLabel.vue'
import type { InputLabelFactory } from './InputLabel.types'
import classes from '../Input.module.css'

export const InputLabel = factory<InputLabelFactory>(InputLabelComponent, {
  classes,
  varsResolver,
})

export type {
  InputLabelCssVariables,
  InputLabelOwnProps,
  InputLabelProps,
  InputLabelSlots,
  InputLabelStylesNames,
  InputLabelFactory,
} from './InputLabel.types'
