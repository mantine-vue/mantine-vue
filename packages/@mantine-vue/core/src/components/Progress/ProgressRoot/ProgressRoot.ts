import { withBoxProps } from '../../../core'
import ProgressRootComponent, { varsResolver } from './ProgressRoot.vue'
import classes from '../Progress.module.css'

export const ProgressRoot = withBoxProps(ProgressRootComponent)
Object.assign(ProgressRoot, { classes, varsResolver })

export type {
  ProgressRootOwnProps,
  ProgressRootProps,
  ProgressRootSlots,
  ProgressRootStylesNames,
} from './ProgressRoot.types'
