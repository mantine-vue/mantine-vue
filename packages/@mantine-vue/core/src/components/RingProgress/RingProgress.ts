import { withBoxProps } from '../../core'
import RingProgressComponent, { varsResolver } from './RingProgress.vue'
import classes from './RingProgress.module.css'

export const RingProgress = withBoxProps(
  Object.assign(RingProgressComponent, { classes, varsResolver }),
)

export type {
  RingProgressCssVariables,
  RingProgressOwnProps,
  RingProgressProps,
  RingProgressSection,
  RingProgressSlots,
  RingProgressStylesNames,
} from './RingProgress.types'
