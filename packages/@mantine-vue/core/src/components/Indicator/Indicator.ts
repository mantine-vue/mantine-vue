import { withBoxProps } from '../../core'
import IndicatorComponent, { varsResolver } from './Indicator.vue'
import classes from './Indicator.module.css'

export const Indicator = withBoxProps(IndicatorComponent)
Object.assign(Indicator, { classes, varsResolver })

export type {
  IndicatorOwnProps,
  IndicatorPosition,
  IndicatorProps,
  IndicatorSlots,
} from './Indicator.types'
