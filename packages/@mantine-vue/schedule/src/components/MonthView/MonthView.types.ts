import type { BoxProps, Factory, ScrollAreaProps } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  BaseViewEmits,
  BaseViewOwnProps,
  EventDropData,
  EventSlots,
  ForwardedProps,
  NativeButtonProps,
} from '../../component-props'
import type {
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
} from '../../types'
import type {
  MoreEventsEmits,
  MoreEventsProps,
  MoreEventsStylesNames,
} from '../MoreEvents/MoreEvents.types'
import type { ScheduleEventStylesNames } from '../ScheduleEvent/ScheduleEvent.types'
import type { CombinedScheduleHeaderStylesNames } from '../ScheduleHeader/ScheduleHeader.types'
import type {
  MonthYearSelectEmits,
  MonthYearSelectProps,
} from '../ScheduleHeader/MonthYearSelect/MonthYearSelect.types'

export type MonthViewOwnStylesNames =
  | 'monthView'
  | 'monthViewScrollArea'
  | 'monthViewInner'
  | 'monthViewWeek'
  | 'monthViewDay'
  | 'monthViewDayLabel'
  | 'monthViewWeekNumber'
  | 'monthViewWeekday'
  | 'monthViewWeekdays'
  | 'monthViewWeekdaysCorner'
  | 'monthViewEvents'
  | 'monthViewBackgroundEvent'

/**
 * `MonthView` forwards `classNames` and `styles` to the components it renders, so their
 * selectors are part of its Styles API.
 */
export type MonthViewStylesNames =
  | MonthViewOwnStylesNames
  | MoreEventsStylesNames
  | ScheduleEventStylesNames
  | CombinedScheduleHeaderStylesNames

export type MonthViewCssVariables = {
  monthView: '--month-view-radius' | '--month-view-max-events'
}

export type MonthViewSlots = EventSlots

/** Props declared by `MonthView` itself. See `MonthViewProps` for the full public type. */
export interface MonthViewOwnProps extends BaseViewOwnProps, StylesApiProps<MonthViewFactory> {
  /**
   * Day the week starts on, `0` – Sunday.
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek

  /**
   * Format of the weekday names above the grid.
   * @default 'ddd'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /**
   * If set, week numbers are displayed in the first column.
   * @default false
   */
  withWeekNumbers?: boolean

  /**
   * If set, weekday names are displayed above the grid.
   * @default true
   */
  withWeekDays?: boolean

  /**
   * If set, every month renders six weeks so the grid height never changes.
   * @default true
   */
  consistentWeeks?: boolean

  /**
   * If set, today is highlighted.
   * @default true
   */
  highlightToday?: boolean

  /**
   * If set, days of the neighbouring months are rendered.
   * @default true
   */
  withOutsideDays?: boolean

  /**
   * Number of events shown per day before the rest collapse into a "more" control.
   * Clamped to the `1` – `10` range.
   * @default 2
   */
  maxEventsPerDay?: number

  /** Returns extra props for the control of the given day. */
  getDayProps?: (date: DateStringValue) => NativeButtonProps

  /** Returns extra props for the control of the week that starts on the given day. */
  getWeekNumberProps?: (weekStartDate: DateStringValue) => NativeButtonProps

  /**
   * If set, events can be dragged onto another day.
   * @default false
   */
  withEventsDragAndDrop?: boolean

  /**
   * Returns whether the given event may be dragged.
   * @default () => true
   */
  canDragEvent?: (event: ScheduleEventData) => boolean

  /**
   * If set, items dragged in from outside the schedule can be dropped on a day, which emits
   * `externalEventDrop`. Enabling event drag and drop turns this on as well.
   * @default false
   */
  withExternalEventDrop?: boolean

  /**
   * If set, dragging across days selects a range.
   * @default false
   */
  withDragSlotSelect?: boolean

  /** Props passed to the month/year select in the header. */
  monthYearSelectProps?: ForwardedProps<MonthYearSelectProps, MonthYearSelectEmits>

  /** Props passed to the `MoreEvents` control of every day. */
  moreEventsProps?: ForwardedProps<MoreEventsProps, MoreEventsEmits>

  /** Props passed to the `ScrollArea` that wraps the grid. */
  scrollAreaProps?: ForwardedProps<ScrollAreaProps>
}

export interface MonthViewProps
  extends Omit<BoxProps, keyof MonthViewOwnProps>, MonthViewOwnProps {}

export interface MonthViewEmits extends BaseViewEmits {
  /** Emitted when a day is clicked. */
  dayClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a week number is clicked. */
  weekNumberClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when an event is dropped on another day. */
  eventDrop: [data: EventDropData]

  /** Emitted when a drag of an event starts. */
  eventDragStart: [event: ScheduleEventData]

  /** Emitted when a drag of an event ends. */
  eventDragEnd: []

  /** Emitted when an item from outside the schedule is dropped on a day. */
  externalEventDrop: [dataTransfer: DataTransfer, date: DateStringValue]

  /** Emitted when a day range is selected by dragging. */
  slotDragEnd: [rangeStart: DateTimeStringValue, rangeEnd: DateTimeStringValue]
}

export type MonthViewFactory = Factory<{
  props: Omit<MonthViewProps, 'rootRef'>
  slots: MonthViewSlots
  emits: MonthViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: MonthViewStylesNames
  vars: MonthViewCssVariables
}>
