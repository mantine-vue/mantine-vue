import { factory } from '../../../core'
import ProgressLabelComponent from './ProgressLabel.vue'
import type { ProgressLabelFactory } from './ProgressLabel.types'
import classes from '../Progress.module.css'

export const ProgressLabel = factory<ProgressLabelFactory>(ProgressLabelComponent, {
  classes,
})

export type {
  ProgressLabelFactory,
  ProgressLabelOwnProps,
  ProgressLabelProps,
  ProgressLabelSlots,
  ProgressLabelStylesNames,
} from './ProgressLabel.types'
