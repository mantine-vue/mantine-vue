import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { NativeButtonProps } from '../../../component-props'
import type { ScheduleLabelsOverride } from '../../../labels'
import type { DateLabelFormat } from '../../../types'

export type MonthYearSelectStylesNames =
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'

/** Props declared by `MonthYearSelect` itself. See `MonthYearSelectProps` for the full public type. */
export interface MonthYearSelectOwnProps extends StylesApiProps<MonthYearSelectFactory> {
  /**
   * Locale passed down to `dayjs` when formatting the label and the month list.
   * @default 'en'
   */
  locale?: string

  /**
   * First year offered by the dropdown.
   * @default current year - 5
   */
  startYear?: number

  /**
   * Last year offered by the dropdown.
   * @default current year + 5
   */
  endYear?: number

  /** Selected year, bound with `v-model:year-value`. */
  yearValue?: number

  /** Selected month index, `0` – January. Bound with `v-model:month-value`. */
  monthValue?: number

  /**
   * Format of the month entries in the dropdown.
   * @default 'MMMM'
   */
  monthsListFormat?: DateLabelFormat

  /**
   * Format of the target control label.
   * @default 'MMMM YYYY' when `withMonths` is set, 'YYYY' otherwise
   */
  labelFormat?: DateLabelFormat

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Returns extra props for the control of the given year. */
  getYearControlProps?: (year: number) => NativeButtonProps

  /** Returns extra props for the control of the given month. */
  getMonthControlProps?: (month: number) => NativeButtonProps

  /**
   * If set, the dropdown lists months next to the years.
   * @default true
   */
  withMonths?: boolean

  /** Label overrides, merged over the ones provided by the surrounding `ScheduleHeader`. */
  labels?: ScheduleLabelsOverride
}

export interface MonthYearSelectProps
  extends Omit<BoxProps, keyof MonthYearSelectOwnProps>, MonthYearSelectOwnProps {}

export interface MonthYearSelectEmits {
  /** Emitted when a year is picked, bound with `v-model:year-value`. */
  'update:yearValue': [year: number]

  /** Emitted when a month is picked, bound with `v-model:month-value`. */
  'update:monthValue': [month: number]

  /** Emitted when a year is picked. */
  yearChange: [year: number]

  /** Emitted when a month is picked. */
  monthChange: [month: number]
}

export type MonthYearSelectFactory = Factory<{
  props: Omit<MonthYearSelectProps, 'rootRef'>
  emits: MonthYearSelectEmits
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: MonthYearSelectStylesNames
}>
