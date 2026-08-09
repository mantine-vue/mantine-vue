import { withBoxProps } from '../../core'
import { InputBase } from '../InputBase'
import PinInputComponent, { varsResolver } from './PinInput.vue'
import classes from './PinInput.module.css'

export const PinInput = withBoxProps(
  Object.assign(PinInputComponent, {
    classes: { ...classes, ...InputBase.classes },
    varsResolver,
  }),
)

export type {
  PinInputCssVariables,
  PinInputMode,
  PinInputOwnProps,
  PinInputProps,
  PinInputStylesNames,
  PinInputTypeAttribute,
} from './PinInput.types'
