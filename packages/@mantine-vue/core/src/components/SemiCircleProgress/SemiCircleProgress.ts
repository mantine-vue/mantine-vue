import { withBoxProps } from '../../core'
import SemiCircleProgressComponent, { varsResolver } from './SemiCircleProgress.vue'
import classes from './SemiCircleProgress.module.css'

export const SemiCircleProgress = withBoxProps(SemiCircleProgressComponent)
Object.assign(SemiCircleProgress, { classes, varsResolver })

export type {
  SemiCircleProgressOwnProps,
  SemiCircleProgressProps,
  SemiCircleProgressSlots,
  SemiCircleProgressStylesNames,
} from './SemiCircleProgress.types'
