import { factory } from '../../core'
import SemiCircleProgressComponent, { varsResolver } from './SemiCircleProgress.vue'
import type { SemiCircleProgressFactory } from './SemiCircleProgress.types'
import classes from './SemiCircleProgress.module.css'

export const SemiCircleProgress = factory<SemiCircleProgressFactory>(SemiCircleProgressComponent, {
  classes,
  varsResolver,
})

export type {
  SemiCircleProgressCssVariables,
  SemiCircleProgressFactory,
  SemiCircleProgressOwnProps,
  SemiCircleProgressProps,
  SemiCircleProgressSlots,
  SemiCircleProgressStylesNames,
} from './SemiCircleProgress.types'
