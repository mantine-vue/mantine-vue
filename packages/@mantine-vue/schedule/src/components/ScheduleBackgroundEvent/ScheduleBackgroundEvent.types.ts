import type { VNodeChild } from 'vue'
import type { BoxProps } from '@mantine-vue/core'
import type { RenderEvent, RenderEventBody } from '../../component-props'
import type { ScheduleEventData } from '../../types'

export type ScheduleBackgroundEventResizeEdge = 'top' | 'bottom' | 'start' | 'end'

export interface ScheduleBackgroundEventOwnProps {
  /** Background event to display. */
  event: ScheduleEventData

  /** If set, the root is a button and the event can be clicked. @default false */
  interactive?: boolean

  /** Function to fully customize event rendering. */
  renderEvent?: RenderEvent

  /** Function to customize event body. */
  renderEventBody?: RenderEventBody

  /** If set, resize handles are rendered on both edges. */
  withResize?: boolean

  /** Axis along which the event is resized. @default 'vertical' */
  resizeAxis?: 'vertical' | 'horizontal'

  /** Props passed to both resize handles. */
  resizeHandleProps?: Record<string, any>

  /** Whether this event is currently being resized. */
  isResizing?: boolean

  /** Edge currently being dragged. */
  activeResizeEdge?: ScheduleBackgroundEventResizeEdge | null
}

export interface ScheduleBackgroundEventProps
  extends Omit<BoxProps, keyof ScheduleBackgroundEventOwnProps>, ScheduleBackgroundEventOwnProps {}

export interface ScheduleBackgroundEventEmits {
  eventClick: [event: ScheduleEventData, nativeEvent: MouseEvent]
  resizeStart: [edge: ScheduleBackgroundEventResizeEdge, nativeEvent: PointerEvent]
}

export interface ScheduleBackgroundEventSlots {
  default?: (props: { event: ScheduleEventData }) => VNodeChild
}
