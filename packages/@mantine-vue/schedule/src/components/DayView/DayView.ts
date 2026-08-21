import { factory } from '@mantine-vue/core'
import DayViewComponent, { varsResolver } from './DayView.vue'
import type { DayViewFactory } from './DayView.types'
import classes from './DayView.module.css'

export const DayView = factory<DayViewFactory>(DayViewComponent, { classes, varsResolver })

export type {
  DayViewCssVariables,
  DayViewEmits,
  DayViewFactory,
  DayViewOwnProps,
  DayViewOwnStylesNames,
  DayViewProps,
  DayViewSlots,
  DayViewStylesNames,
} from './DayView.types'
