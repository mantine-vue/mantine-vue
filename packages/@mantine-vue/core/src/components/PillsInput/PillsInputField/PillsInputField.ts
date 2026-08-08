import { withBoxProps } from '../../../core'
import PillsInputFieldComponent from './PillsInputField.vue'
import classes from '../PillsInput.module.css'

/** Text field rendered alongside the pills inside a `PillsInput`. */
export const PillsInputField = withBoxProps(Object.assign(PillsInputFieldComponent, { classes }))

export type {
  PillsInputFieldOwnProps,
  PillsInputFieldProps,
  PillsInputFieldStylesNames,
} from './PillsInputField.types'
