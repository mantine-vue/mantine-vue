import { factory } from '../../core'
import RingProgressComponent, { varsResolver } from './RingProgress.vue'
import type { RingProgressFactory } from './RingProgress.types'
import classes from './RingProgress.module.css'

export const RingProgress = factory<RingProgressFactory>(RingProgressComponent, {
  classes,
  varsResolver,
})

export type {
  RingProgressCssVariables,
  RingProgressFactory,
  RingProgressOwnProps,
  RingProgressProps,
  RingProgressSection,
  RingProgressSlots,
  RingProgressStylesNames,
} from './RingProgress.types'
