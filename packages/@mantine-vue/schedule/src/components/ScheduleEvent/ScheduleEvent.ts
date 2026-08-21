import { factory } from '@mantine-vue/core'
import ScheduleEventComponent, { varsResolver } from './ScheduleEvent.vue'
import type { ScheduleEventFactory } from './ScheduleEvent.types'
import classes from './ScheduleEvent.module.css'

export const ScheduleEvent = factory<ScheduleEventFactory>(ScheduleEventComponent, {
  classes,
  varsResolver,
})

export type { RenderEvent, RenderEventBody, ScheduleEventRenderProps } from '../../component-props'

export type {
  ScheduleEventCssVariables,
  ScheduleEventEmits,
  ScheduleEventFactory,
  ScheduleEventHanging,
  ScheduleEventOwnProps,
  ScheduleEventProps,
  ScheduleEventResizeEdge,
  ScheduleEventSlots,
  ScheduleEventStylesNames,
} from './ScheduleEvent.types'
