import type { CSSProperties, VNodeChild } from 'vue'
import type { BoxProps, Factory, ScrollAreaProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  EventSlots,
  ForwardedProps,
  TimeViewEmits,
  TimeViewOwnProps,
} from '../../component-props'
import type { DateLabelFormat, DateStringValue, DayOfWeek } from '../../types'
import type { CurrentTimeIndicatorStylesNames } from '../CurrentTimeIndicator/CurrentTimeIndicator.types'
import type { ScheduleEventStylesNames } from '../ScheduleEvent/ScheduleEvent.types'
import type { CombinedScheduleHeaderStylesNames } from '../ScheduleHeader/ScheduleHeader.types'

export type WeekViewOwnStylesNames =
  | 'weekView'
  | 'weekViewRoot'
  | 'weekViewHeader'
  | 'weekViewInner'
  | 'weekViewAllDaySlotsEvents'
  | 'weekViewAllDaySlots'
  | 'weekViewAllDaySlotsList'
  | 'weekViewAllDaySlotsLabel'
  | 'weekViewScrollArea'
  | 'weekViewCorner'
  | 'weekViewSlotLabels'
  | 'weekViewSlotLabel'
  | 'weekViewDayLabel'
  | 'weekViewDayWeekday'
  | 'weekViewDay'
  | 'weekViewDayNumber'
  | 'weekViewDaySlot'
  | 'weekViewDaySlots'
  | 'weekViewWeekLabel'
  | 'weekViewWeekNumber'
  | 'weekViewBackgroundEvent'

/**
 * `WeekView` forwards `classNames` and `styles` to the components it renders, so their
 * selectors are part of its Styles API.
 */
export type WeekViewStylesNames =
  | WeekViewOwnStylesNames
  | ScheduleEventStylesNames
  | CurrentTimeIndicatorStylesNames
  | CombinedScheduleHeaderStylesNames

export type WeekViewCssVariables = {
  weekView: '--week-view-radius' | '--week-view-slot-height' | '--week-view-all-day-slots-height'
}

/** Range covered by the label shown in the week header. */
export interface WeekLabelPayload {
  /** First day of the week, `YYYY-MM-DD`. */
  weekStart: DateStringValue

  /** Last day of the week, `YYYY-MM-DD`. */
  weekEnd: DateStringValue
}

export interface WeekViewSlots extends EventSlots {
  /**
   * Replaces the label shown between the navigation controls.
   * Takes precedence over `renderWeekLabel`.
   */
  weekLabel?: (props: WeekLabelPayload) => VNodeChild
}

/** Props declared by `WeekView` itself. See `WeekViewProps` for the full public type. */
export interface WeekViewOwnProps extends TimeViewOwnProps, StylesApiProps<WeekViewFactory> {
  /**
   * Length of one time slot in minutes.
   * @default 60
   */
  intervalMinutes?: number

  /**
   * If set, a line marking the current time is displayed.
   * @default true
   */
  withCurrentTimeIndicator?: boolean

  /**
   * If set, the current time indicator is shown on the matching weekday even when another
   * week is displayed.
   * @default false
   */
  forceCurrentTimeIndicator?: boolean

  /**
   * Day the week starts on, `0` – Sunday.
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek

  /**
   * Format of the weekday names in the header.
   * @default 'ddd'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * Format of the day numbers in the header.
   * @default 'D'
   */
  dayFormat?: DateLabelFormat

  /**
   * If set, the week number is displayed in the top-left corner.
   * @default true
   */
  withWeekNumber?: boolean

  /**
   * If set, the week number is displayed in the top-left corner.
   * @deprecated Use `withWeekNumber` instead.
   */
  withWeekNumbers?: boolean

  /**
   * If set, an all-day row is rendered above the time slots.
   * @default true
   */
  withAllDaySlots?: boolean

  /**
   * If set, an all-day row is rendered above the time slots.
   * @deprecated Use `withAllDaySlots` instead.
   */
  withAllDaySlot?: boolean

  /**
   * Height of the all-day row.
   * @default 44
   */
  allDaySlotHeight?: CSSProperties['height']

  /**
   * Height of the all-day row.
   * @deprecated Use `allDaySlotHeight` instead.
   */
  allDaySlotsHeight?: CSSProperties['height']

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /**
   * If set, weekend days are part of the week.
   * @default true
   */
  withWeekendDays?: boolean

  /**
   * Format of the week label shown in the header.
   * @default 'MMM D'
   */
  weekLabelFormat?: DateLabelFormat

  /**
   * Replaces the label shown between the navigation controls. Can also be set with the
   * `weekLabel` slot, which takes precedence over the prop.
   */
  renderWeekLabel?: (payload: WeekLabelPayload) => VNodeChild

  /** Props passed to the `ScrollArea` that wraps the week grid. */
  scrollAreaProps?: ForwardedProps<ScrollAreaProps>
}

export interface WeekViewProps extends Omit<BoxProps, keyof WeekViewOwnProps>, WeekViewOwnProps {}

export type WeekViewEmits = TimeViewEmits

export type WeekViewFactory = Factory<{
  props: Omit<WeekViewProps, 'rootRef'>
  slots: WeekViewSlots
  emits: WeekViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WeekViewStylesNames
  vars: WeekViewCssVariables
}>
