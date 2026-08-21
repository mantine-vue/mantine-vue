import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  BaseViewEmits,
  BaseViewOwnProps,
  NativeButtonProps,
  ScheduleEventRenderProps,
} from '../../component-props'
import type {
  DateLabelFormat,
  DateStringValue,
  DayOfWeek,
  ScheduleEventData,
  ScheduleMode,
} from '../../types'

export type MobileMonthViewStylesNames =
  | 'mobileMonthView'
  | 'mobileMonthViewHeader'
  | 'mobileMonthViewHeaderBackButton'
  | 'mobileMonthViewHeaderLabel'
  | 'mobileMonthViewCalendar'
  | 'mobileMonthViewWeekdays'
  | 'mobileMonthViewWeekday'
  | 'mobileMonthViewWeekdaysCorner'
  | 'mobileMonthViewWeek'
  | 'mobileMonthViewWeekNumber'
  | 'mobileMonthViewDay'
  | 'mobileMonthViewDayIndicators'
  | 'mobileMonthViewDayIndicator'
  | 'mobileMonthViewEventsList'
  | 'mobileMonthViewEventsHeader'
  | 'mobileMonthViewEvent'
  | 'mobileMonthViewEventBody'
  | 'mobileMonthViewEventColor'
  | 'mobileMonthViewEventTitle'
  | 'mobileMonthViewEventTime'
  | 'mobileMonthViewNoEvents'

export type MobileMonthViewCssVariables = {
  mobileMonthView: '--mobile-month-view-radius'
}

/** Payload of the `header` slot and of the `renderHeader` prop. */
export interface MobileMonthViewHeaderPayload {
  /** Interaction mode of the view. */
  mode: ScheduleMode

  /** Month currently displayed. */
  date: Date | DateStringValue

  /** The header the view would render, so a custom one can reuse parts of it. */
  defaultHeader: VNodeChild
}

export interface MobileMonthViewSlots {
  /** Replaces every event in the list. Takes precedence over `renderEvent`. */
  event?: (props: ScheduleEventRenderProps & { event: ScheduleEventData }) => VNodeChild

  /** Replaces the header above the calendar. Takes precedence over `renderHeader`. */
  header?: (props: MobileMonthViewHeaderPayload) => VNodeChild
}

/** Props declared by `MobileMonthView` itself. See `MobileMonthViewProps` for the full public type. */
export interface MobileMonthViewOwnProps
  extends BaseViewOwnProps, StylesApiProps<MobileMonthViewFactory> {
  /** Selected day, bound with `v-model:selected-date`. */
  selectedDate?: Date | DateStringValue | null

  /** Day selected on the first render when `selectedDate` is not set. @default today */
  defaultSelectedDate?: Date | DateStringValue | null

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
   * Day the week starts on, `0` – Sunday.
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek

  /**
   * Format of the weekday names above the grid.
   * @default 'dd'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /** Returns extra props for the control of the week that starts on the given day. */
  getWeekNumberProps?: (weekStartDate: DateStringValue) => NativeButtonProps

  /** Returns extra props for the control of the given day. */
  getDayProps?: (date: DateStringValue) => NativeButtonProps

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
   * @default false
   */
  withOutsideDays?: boolean

  /**
   * Format of the heading above the event list.
   * @default 'dddd, MMMM D'
   */
  eventsHeaderFormat?: DateLabelFormat

  /**
   * Replaces the header above the calendar. Can also be set with the `header` slot,
   * which takes precedence over the prop.
   */
  renderHeader?: (payload: MobileMonthViewHeaderPayload) => VNodeChild
}

export interface MobileMonthViewProps
  extends Omit<BoxProps, keyof MobileMonthViewOwnProps>, MobileMonthViewOwnProps {}

export interface MobileMonthViewEmits extends BaseViewEmits {
  /** Emitted when another day is selected, bound with `v-model:selected-date`. */
  'update:selectedDate': [date: DateStringValue | null]

  /** Emitted when another day is selected. */
  selectedDateChange: [date: DateStringValue | null]

  /** Emitted when a day is clicked. */
  dayClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a week number is clicked. */
  weekNumberClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when the year control in the header is clicked. */
  yearClick: []
}

export type MobileMonthViewFactory = Factory<{
  props: Omit<MobileMonthViewProps, 'rootRef'>
  slots: MobileMonthViewSlots
  emits: MobileMonthViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: MobileMonthViewStylesNames
  vars: MobileMonthViewCssVariables
}>
