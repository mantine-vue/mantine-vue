import { factory } from '../../../core'
import CheckboxIndicatorComponent, { varsResolver } from './CheckboxIndicator.vue'
import type { CheckboxIndicatorFactory } from './CheckboxIndicator.types'
import classes from './CheckboxIndicator.module.css'

export const CheckboxIndicator = factory<CheckboxIndicatorFactory>(CheckboxIndicatorComponent, {
  classes,
  varsResolver,
})

export type {
  CheckboxIndicatorOwnProps,
  CheckboxIndicatorProps,
  CheckboxIndicatorSlots,
  CheckboxIndicatorVariant,
  CheckboxIndicatorFactory,
} from './CheckboxIndicator.types'
