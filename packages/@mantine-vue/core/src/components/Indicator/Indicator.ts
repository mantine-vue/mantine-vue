import { factory } from '../../core'
import IndicatorComponent, { varsResolver } from './Indicator.vue'
import type { IndicatorFactory } from './Indicator.types'
import classes from './Indicator.module.css'

export const Indicator = factory<IndicatorFactory>(IndicatorComponent, { classes, varsResolver })

export type {
  IndicatorOwnProps,
  IndicatorPosition,
  IndicatorProps,
  IndicatorSlots,
  IndicatorFactory,
} from './Indicator.types'
