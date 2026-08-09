import { withBoxProps } from '../../../core'
import ProgressSectionComponent from './ProgressSection.vue'
import classes from '../Progress.module.css'

export const ProgressSection = withBoxProps(ProgressSectionComponent)
Object.assign(ProgressSection, { classes })

export type {
  ProgressSectionOwnProps,
  ProgressSectionProps,
  ProgressSectionSlots,
  ProgressSectionStylesNames,
} from './ProgressSection.types'
