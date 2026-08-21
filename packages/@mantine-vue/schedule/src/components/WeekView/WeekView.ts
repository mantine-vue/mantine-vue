import { factory } from '@mantine-vue/core'
import WeekViewComponent, { varsResolver } from './WeekView.vue'
import type { WeekViewFactory } from './WeekView.types'
import classes from './WeekView.module.css'

export const WeekView = factory<WeekViewFactory>(WeekViewComponent, { classes, varsResolver })

export type {
  WeekLabelPayload,
  WeekViewCssVariables,
  WeekViewEmits,
  WeekViewFactory,
  WeekViewOwnProps,
  WeekViewOwnStylesNames,
  WeekViewProps,
  WeekViewSlots,
  WeekViewStylesNames,
} from './WeekView.types'
