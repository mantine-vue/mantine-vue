import InputWrapperComponent, { varsResolver } from './InputWrapper.vue'
import classes from '../Input.module.css'

export const InputWrapper = Object.assign(InputWrapperComponent, { classes, varsResolver })

export type {
  InputWrapperCssVariables,
  InputWrapperOwnProps,
  InputWrapperProps,
  InputWrapperSlots,
  InputWrapperStylesNames,
} from './InputWrapper.types'
