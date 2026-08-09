import { withBoxProps } from '../../core'
import FloatingIndicatorComponent, { varsResolver } from './FloatingIndicator.vue'
import classes from './FloatingIndicator.module.css'

export const FloatingIndicator = withBoxProps(FloatingIndicatorComponent)
Object.assign(FloatingIndicator, { classes, varsResolver })

export type {
  FloatingIndicatorCssVariables,
  FloatingIndicatorOwnProps,
  FloatingIndicatorProps,
  FloatingIndicatorSlots,
  FloatingIndicatorStylesNames,
} from './FloatingIndicator.types'

export { useFloatingIndicator } from './use-floating-indicator'
export type { UseFloatingIndicatorInput } from './use-floating-indicator'
