import { factory } from '../../../core'
import ProgressRootComponent, { varsResolver } from './ProgressRoot.vue'
import type { ProgressRootFactory } from './ProgressRoot.types'
import classes from '../Progress.module.css'

export const ProgressRoot = factory<ProgressRootFactory>(ProgressRootComponent, {
  classes,
  varsResolver,
})

export type {
  ProgressRootCssVariables,
  ProgressRootFactory,
  ProgressRootOwnProps,
  ProgressRootProps,
  ProgressRootSlots,
  ProgressRootStylesNames,
} from './ProgressRoot.types'
