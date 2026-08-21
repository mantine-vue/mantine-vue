import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type {
  BaseViewEmits,
  BaseViewOwnProps,
  ForwardedProps,
  NativeButtonProps,
} from '../../component-props'
import type { DateLabelFormat, DateStringValue, DayOfWeek } from '../../types'
import type { CombinedScheduleHeaderStylesNames } from '../ScheduleHeader/ScheduleHeader.types'
import type {
  MonthYearSelectEmits,
  MonthYearSelectProps,
} from '../ScheduleHeader/MonthYearSelect/MonthYearSelect.types'

export type YearViewOwnStylesNames =
  | 'yearView'
  | 'yearViewMonths'
  | 'yearViewMonth'
  | 'yearViewMonthCaption'
  | 'yearViewWeekdays'
  | 'yearViewWeekday'
  | 'yearViewWeekdaysCorner'
  | 'yearViewWeek'
  | 'yearViewWeekNumber'
  | 'yearViewDay'
  | 'yearViewDayIndicators'
  | 'yearViewDayIndicator'

/**
 * `YearView` forwards `classNames` and `styles` to the header it renders, so the header
 * selectors are part of its Styles API.
 */
export type YearViewStylesNames = YearViewOwnStylesNames | CombinedScheduleHeaderStylesNames

export type YearViewCssVariables = {
  yearView: '--year-view-radius'
}

/** Props declared by `YearView` itself. See `YearViewProps` for the full public type. */
export interface YearViewOwnProps extends BaseViewOwnProps, StylesApiProps<YearViewFactory> {
  /**
   * Day the week starts on, `0` – Sunday.
   * @default 1
   */
  firstDayOfWeek?: DayOfWeek

  /**
   * Format of the weekday names above each month.
   * @default 'dd'
   */
  weekdayFormat?: DateLabelFormat

  /**
   * Days marked as weekend, `0` – Sunday.
   * @default [0, 6]
   */
  weekendDays?: DayOfWeek[]

  /**
   * If set, week numbers are displayed in the first column of each month.
   * @default false
   */
  withWeekNumbers?: boolean

  /**
   * If set, weekday names are displayed above each month.
   * @default true
   */
  withWeekDays?: boolean

  /**
   * If set, every month renders six weeks so the grids all have the same height.
   * @default false
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
   * Format of the month captions.
   * @default 'MMMM'
   */
  monthsListFormat?: DateLabelFormat

  /** Returns extra props for the control of the given day. */
  getDayProps?: (date: DateStringValue) => NativeButtonProps

  /** Returns extra props for the control of the week that starts on the given day. */
  getWeekNumberProps?: (weekStartDate: DateStringValue) => NativeButtonProps

  /** Props passed to the year select in the header. */
  monthYearSelectProps?: ForwardedProps<MonthYearSelectProps, MonthYearSelectEmits>
}

export interface YearViewProps extends Omit<BoxProps, keyof YearViewOwnProps>, YearViewOwnProps {}

export interface YearViewEmits extends BaseViewEmits {
  /** Emitted when a day is clicked. */
  dayClick: [date: DateStringValue, nativeEvent: MouseEvent]

  /** Emitted when a month caption is clicked. */
  monthClick: [month: DateStringValue]

  /** Emitted when a week number is clicked. */
  weekNumberClick: [date: DateStringValue, nativeEvent: MouseEvent]
}

export type YearViewFactory = Factory<{
  props: Omit<YearViewProps, 'rootRef'>
  emits: YearViewEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: YearViewStylesNames
  vars: YearViewCssVariables
}>
