import { factory } from '../../../core'
import ProgressSectionComponent from './ProgressSection.vue'
import type { ProgressSectionFactory } from './ProgressSection.types'
import classes from '../Progress.module.css'

export const ProgressSection = factory<ProgressSectionFactory>(ProgressSectionComponent, {
  classes,
})

export type {
  ProgressSectionFactory,
  ProgressSectionOwnProps,
  ProgressSectionProps,
  ProgressSectionSlots,
  ProgressSectionStylesNames,
} from './ProgressSection.types'
