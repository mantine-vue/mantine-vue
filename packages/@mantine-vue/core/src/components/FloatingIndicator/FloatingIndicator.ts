import { factory } from '../../core'
import FloatingIndicatorComponent, { varsResolver } from './FloatingIndicator.vue'
import type { FloatingIndicatorFactory } from './FloatingIndicator.types'
import classes from './FloatingIndicator.module.css'

export const FloatingIndicator = factory<FloatingIndicatorFactory>(FloatingIndicatorComponent, {
  classes,
  varsResolver,
})

export type {
  FloatingIndicatorCssVariables,
  FloatingIndicatorOwnProps,
  FloatingIndicatorProps,
  FloatingIndicatorSlots,
  FloatingIndicatorStylesNames,
  FloatingIndicatorFactory,
} from './FloatingIndicator.types'

export { useFloatingIndicator } from './use-floating-indicator'
export type { UseFloatingIndicatorInput } from './use-floating-indicator'
