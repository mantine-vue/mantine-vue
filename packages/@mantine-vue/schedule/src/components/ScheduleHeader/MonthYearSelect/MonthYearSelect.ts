import { factory } from '@mantine-vue/core'
import MonthYearSelectComponent from './MonthYearSelect.vue'
import type { MonthYearSelectFactory } from './MonthYearSelect.types'
import classes from './MonthYearSelect.module.css'

export const MonthYearSelect = factory<MonthYearSelectFactory>(MonthYearSelectComponent, {
  classes,
})

export type {
  MonthYearSelectEmits,
  MonthYearSelectFactory,
  MonthYearSelectOwnProps,
  MonthYearSelectProps,
  MonthYearSelectStylesNames,
} from './MonthYearSelect.types'
