import { withBoxProps } from '../../../core'
import CheckboxIndicatorComponent, { varsResolver } from './CheckboxIndicator.vue'
import classes from './CheckboxIndicator.module.css'

export const CheckboxIndicator = withBoxProps(CheckboxIndicatorComponent)
Object.assign(CheckboxIndicator, { classes, varsResolver })

export type {
  CheckboxIndicatorOwnProps,
  CheckboxIndicatorProps,
  CheckboxIndicatorSlots,
  CheckboxIndicatorVariant,
} from './CheckboxIndicator.types'
