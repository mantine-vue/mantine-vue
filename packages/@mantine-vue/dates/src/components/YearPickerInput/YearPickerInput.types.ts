import type { DatePickerInputProps as BaseProps } from '../../types'

/** Props accepted by YearPickerInput. */
export interface YearPickerInputProps extends Omit<BaseProps, 'valueFormat'> {
  /** `dayjs` format to display input value @default 'YYYY' */
  valueFormat?: string
}
