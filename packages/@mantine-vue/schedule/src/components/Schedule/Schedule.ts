import { factory } from '@mantine-vue/core'
import ScheduleComponent from './Schedule.vue'
import type { ScheduleFactory } from './Schedule.types'
import classes from './Schedule.module.css'

export const Schedule = factory<ScheduleFactory>(ScheduleComponent, { classes })

export type {
  ScheduleEmits,
  ScheduleFactory,
  ScheduleLayout,
  ScheduleOwnProps,
  ScheduleOwnStylesNames,
  ScheduleProps,
  ScheduleSlots,
  ScheduleStylesNames,
} from './Schedule.types'
