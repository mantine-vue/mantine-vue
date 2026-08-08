import type { DatePickerInputProps as BaseProps } from '../../types'

/** Props accepted by MonthPickerInput. */
export interface MonthPickerInputProps extends Omit<BaseProps, 'valueFormat'> {
  /** `dayjs` format for input value @default 'MMMM YYYY' */
  valueFormat?: string
}
