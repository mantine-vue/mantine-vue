import { factory } from '@mantine-vue/core'
import ResourcesScheduleComponent from './ResourcesSchedule.vue'
import type { ResourcesScheduleFactory } from './ResourcesSchedule.types'
import classes from './ResourcesSchedule.module.css'

export const ResourcesSchedule = factory<ResourcesScheduleFactory>(ResourcesScheduleComponent, {
  classes,
})

export type {
  ResourcesScheduleEmits,
  ResourcesScheduleFactory,
  ResourcesScheduleOwnProps,
  ResourcesScheduleOwnStylesNames,
  ResourcesScheduleProps,
  ResourcesScheduleSlots,
  ResourcesScheduleStylesNames,
  ResourcesScheduleViewLevel,
  ResourcesScheduleViewProps,
} from './ResourcesSchedule.types'
