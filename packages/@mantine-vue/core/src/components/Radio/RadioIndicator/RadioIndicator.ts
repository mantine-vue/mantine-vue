import { withBoxProps } from '../../../core'
import RadioIndicatorComponent, { varsResolver } from './RadioIndicator.vue'
import classes from './RadioIndicator.module.css'

export const RadioIndicator = withBoxProps(RadioIndicatorComponent)
Object.assign(RadioIndicator, { classes, varsResolver })

export type {
  RadioIndicatorOwnProps,
  RadioIndicatorProps,
  RadioIndicatorSlots,
  RadioIndicatorVariant,
} from './RadioIndicator.types'
