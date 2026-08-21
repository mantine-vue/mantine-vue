import { factory } from '@mantine-vue/core'
import MonthViewComponent, { varsResolver } from './MonthView.vue'
import type { MonthViewFactory } from './MonthView.types'
import classes from './MonthView.module.css'

export const MonthView = factory<MonthViewFactory>(MonthViewComponent, { classes, varsResolver })

export type {
  MonthViewCssVariables,
  MonthViewEmits,
  MonthViewFactory,
  MonthViewOwnProps,
  MonthViewOwnStylesNames,
  MonthViewProps,
  MonthViewSlots,
  MonthViewStylesNames,
} from './MonthView.types'
