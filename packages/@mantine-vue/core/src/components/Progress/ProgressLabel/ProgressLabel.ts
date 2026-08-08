import { withBoxProps } from '../../../core'
import ProgressLabelComponent from './ProgressLabel.vue'
import classes from '../Progress.module.css'

export const ProgressLabel = withBoxProps(ProgressLabelComponent)
Object.assign(ProgressLabel, { classes })

export type {
  ProgressLabelOwnProps,
  ProgressLabelProps,
  ProgressLabelSlots,
} from './ProgressLabel.types'
