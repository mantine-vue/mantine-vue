import { withBoxProps } from '../../../core'
import InputLabelComponent, { varsResolver } from './InputLabel.vue'
import classes from '../Input.module.css'

export const InputLabel = withBoxProps(
  Object.assign(InputLabelComponent, { classes, varsResolver }),
)

export type {
  InputLabelCssVariables,
  InputLabelOwnProps,
  InputLabelProps,
  InputLabelSlots,
  InputLabelStylesNames,
} from './InputLabel.types'
