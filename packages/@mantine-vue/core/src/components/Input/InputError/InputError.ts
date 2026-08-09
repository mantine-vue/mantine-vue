import { withBoxProps } from '../../../core'
import InputErrorComponent, { varsResolver } from './InputError.vue'
import classes from '../Input.module.css'

export const InputError = withBoxProps(
  Object.assign(InputErrorComponent, { classes, varsResolver }),
)

export type {
  InputErrorCssVariables,
  InputErrorOwnProps,
  InputErrorProps,
  InputErrorSlots,
  InputErrorStylesNames,
} from './InputError.types'
