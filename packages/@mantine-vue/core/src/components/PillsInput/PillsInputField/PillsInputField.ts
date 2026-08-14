import { factory } from '../../../core'
import PillsInputFieldComponent from './PillsInputField.vue'
import type { PillsInputFieldFactory } from './PillsInputField.types'
import classes from '../PillsInput.module.css'

export const PillsInputField = factory<PillsInputFieldFactory>(PillsInputFieldComponent, {
  classes,
})

export type {
  PillsInputFieldFactory,
  PillsInputFieldOwnProps,
  PillsInputFieldProps,
  PillsInputFieldStylesNames,
} from './PillsInputField.types'
