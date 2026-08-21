import { factory } from '@mantine-vue/core'
import HeaderControlComponent, { varsResolver } from './HeaderControl.vue'
import ScheduleHeaderNextComponent from './ScheduleHeaderNext.vue'
import ScheduleHeaderPreviousComponent from './ScheduleHeaderPrevious.vue'
import ScheduleHeaderTodayComponent from './ScheduleHeaderToday.vue'
import type { HeaderControlFactory } from './HeaderControl.types'
import classes from './HeaderControl.module.css'

export const HeaderControl = factory<HeaderControlFactory>(HeaderControlComponent, {
  classes,
  varsResolver,
})

/** `HeaderControl` preset that navigates to the next period. */
export const ScheduleHeaderNext = factory<HeaderControlFactory>(ScheduleHeaderNextComponent, {
  classes,
  varsResolver,
})

/** `HeaderControl` preset that navigates to the previous period. */
export const ScheduleHeaderPrevious = factory<HeaderControlFactory>(
  ScheduleHeaderPreviousComponent,
  { classes, varsResolver },
)

/** `HeaderControl` preset that navigates to today. */
export const ScheduleHeaderToday = factory<HeaderControlFactory>(ScheduleHeaderTodayComponent, {
  classes,
  varsResolver,
})

export type {
  HeaderControlCssVariables,
  HeaderControlFactory,
  HeaderControlOwnProps,
  HeaderControlProps,
  HeaderControlSlots,
  HeaderControlStylesNames,
} from './HeaderControl.types'
