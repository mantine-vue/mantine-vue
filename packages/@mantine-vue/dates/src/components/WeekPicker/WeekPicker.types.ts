import type { DatePickerProps, DateStringValue, MonthWeekControlProps } from '../../types'

/** Props accepted by `WeekPicker`. */
export interface WeekPickerProps extends Omit<DatePickerProps, 'withWeekNumbers'> {
  /** Passes props down to week controls, receives the first day of the week */
  getWeekControlProps?: (weekStart: DateStringValue) => Partial<MonthWeekControlProps>
}

export type WeekPickerStylesNames =
  | 'weekPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'weekControl'
