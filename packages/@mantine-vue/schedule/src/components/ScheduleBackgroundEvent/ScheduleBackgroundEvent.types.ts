import type { VNodeChild } from 'vue'
import type { BoxProps } from '@mantine-vue/core'
import type { RenderEvent, RenderEventBody } from '../../component-props'
import type { ScheduleEventData } from '../../types'

export interface ScheduleBackgroundEventOwnProps {
  /** Background event to display. */
  event: ScheduleEventData

  /** If set, the root is a button and the event can be clicked. @default false */
  interactive?: boolean

  /** Function to fully customize event rendering. */
  renderEvent?: RenderEvent

  /** Function to customize event body. */
  renderEventBody?: RenderEventBody
}

export interface ScheduleBackgroundEventProps
  extends Omit<BoxProps, keyof ScheduleBackgroundEventOwnProps>, ScheduleBackgroundEventOwnProps {}

export interface ScheduleBackgroundEventEmits {
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]
}

export interface ScheduleBackgroundEventSlots {
  default?: (props: { event: ScheduleEventData }) => VNodeChild
}
