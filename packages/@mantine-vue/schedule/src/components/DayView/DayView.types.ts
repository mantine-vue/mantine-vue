import type { CSSProperties } from 'vue'
import type { BoxProps, Factory, ScrollAreaProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventSlots,
  ForwardedProps,
  TimeViewEmits,
  TimeViewOwnProps,
} from '../../component-props'
import type { DateLabelFormat, ScheduleEventOverlapMode } from '../../types'
import type { CurrentTimeIndicatorStylesNames } from '../CurrentTimeIndicator/CurrentTimeIndicator.types'
import type {
  MoreEventsEmits,
  MoreEventsProps,
  MoreEventsStylesNames,
} from '../MoreEvents/MoreEvents.types'
import type { ScheduleEventStylesNames } from '../ScheduleEvent/ScheduleEvent.types'
import type {
  CombinedScheduleHeaderStylesNames,
  ScheduleHeaderStylesNames,
} from '../ScheduleHeader/ScheduleHeader.types'
import type { MonthYearSelectStylesNames } from '../ScheduleHeader/MonthYearSelect/MonthYearSelect.types'

export type DayViewOwnStylesNames =
  | 'dayView'
  | 'dayViewInner'
  | 'dayViewScrollArea'
  | 'dayViewAllDay'
  | 'dayViewAllDayEvents'
  | 'dayViewSlot'
  | 'dayViewSlots'
  | 'dayViewTimeSlots'
  | 'dayViewSlotLabel'
  | 'dayViewSlotLabels'
  | 'dayViewBackgroundEvent'
  | 'dayViewBackgroundEventResizeHandle'

/**
 * `DayView` forwards `classNames` and `styles` to the components it renders, so their
 * selectors are part of its Styles API. The month/year select is excluded because the day
 * header shows a plain title instead.
 */
export type DayViewStylesNames =
  | DayViewOwnStylesNames
  | MoreEventsStylesNames
  | ScheduleEventStylesNames
  | Exclude<CombinedScheduleHeaderStylesNames, MonthYearSelectStylesNames>
  | CurrentTimeIndicatorStylesNames
  | ScheduleHeaderStylesNames

export type DayViewCssVariables = {
  dayView:
    | '--day-view-radius'
    | '--day-view-slot-height'
    | '--day-view-all-day-slot-height'
    | '--event-raise-delay'
    | '--event-z-index'
    | '--event-z-index-raised'
}

export type DayViewSlots = EventSlots

/** Props declared by `DayView` itself. See `DayViewProps` for the full public type. */
export interface DayViewOwnProps extends TimeViewOwnProps, StylesApiProps<DayViewFactory> {
  /** Determines how overlapping events are laid out. @default 'columns' */
  eventOverlapMode?: ScheduleEventOverlapMode

  /** Time in ms before a hovered cascade event is raised above covering events. @default 600 */
  eventOverlapRaiseDelay?: number

  /**
   * Length of one time slot in minutes.
   * @default 15
   */
  intervalMinutes?: number

  /**
   * Format of the date shown in the header.
   * @default 'MMMM D, YYYY'
   */
  headerFormat?: DateLabelFormat

  /**
   * If set, an all-day row is rendered above the time slots.
   * @default true
   */
  withAllDaySlot?: boolean

  /**
   * Height of the all-day row.
   * @default 44
   */
  allDaySlotHeight?: CSSProperties['height']

  /**
   * Number of all-day events shown before the rest collapse into a "more" control.
   * @default 3
   */
  maxAllDayEvents?: number

  /** Props passed to the `MoreEvents` control of the all-day row. */
  moreEventsProps?: ForwardedProps<MoreEventsProps, MoreEventsEmits>

  /** Props passed to the `ScrollArea` that wraps the time grid. */
  scrollAreaProps?: ForwardedProps<ScrollAreaProps>
}

export interface DayViewProps extends Omit<BoxProps, keyof DayViewOwnProps>, DayViewOwnProps {}

export type DayViewEmits = TimeViewEmits

export type DayViewFactory = Factory<{
  props: Omit<DayViewProps, 'rootRef'>
  slots: DayViewSlots
  emits: DayViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: DayViewStylesNames
  vars: DayViewCssVariables
}>
