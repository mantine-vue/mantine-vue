import { factory } from '@mantine-vue/core'
import ScheduleHeaderComponent from './ScheduleHeader.vue'
import {
  HeaderControl,
  ScheduleHeaderNext,
  ScheduleHeaderPrevious,
  ScheduleHeaderToday,
} from './HeaderControl'
import { MonthYearSelect } from './MonthYearSelect'
import { ViewSelect } from './ViewSelect'
import type { ScheduleHeaderFactory } from './ScheduleHeader.types'
import classes from './ScheduleHeader.module.css'

export const ScheduleHeader = factory<
  ScheduleHeaderFactory & {
    staticComponents: {
      Control: typeof HeaderControl
      Previous: typeof ScheduleHeaderPrevious
      Next: typeof ScheduleHeaderNext
      Today: typeof ScheduleHeaderToday
      ViewSelect: typeof ViewSelect
      MonthYearSelect: typeof MonthYearSelect
    }
  }
>(ScheduleHeaderComponent, {
  classes,
  Control: HeaderControl,
  Previous: ScheduleHeaderPrevious,
  Next: ScheduleHeaderNext,
  Today: ScheduleHeaderToday,
  ViewSelect,
  MonthYearSelect,
})

export type {
  CombinedScheduleHeaderStylesNames,
  ScheduleHeaderFactory,
  ScheduleHeaderOwnProps,
  ScheduleHeaderProps,
  ScheduleHeaderSlots,
  ScheduleHeaderStylesNames,
} from './ScheduleHeader.types'
