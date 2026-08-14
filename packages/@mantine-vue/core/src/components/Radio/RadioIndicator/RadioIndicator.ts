import { factory } from '../../../core'
import RadioIndicatorComponent, { varsResolver } from './RadioIndicator.vue'
import type { RadioIndicatorFactory } from './RadioIndicator.types'
import classes from './RadioIndicator.module.css'

export const RadioIndicator = factory<RadioIndicatorFactory>(RadioIndicatorComponent, {
  classes,
  varsResolver,
})

export type {
  RadioIndicatorCssVariables,
  RadioIndicatorFactory,
  RadioIndicatorOwnProps,
  RadioIndicatorProps,
  RadioIndicatorSlots,
  RadioIndicatorStylesNames,
  RadioIndicatorVariant,
} from './RadioIndicator.types'
