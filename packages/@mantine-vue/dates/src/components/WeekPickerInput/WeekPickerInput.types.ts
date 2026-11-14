import type { DateFormatter, DatePickerValueType, PickerInputBaseProps } from '../../types'
import type { WeekPickerProps } from '../WeekPicker/WeekPicker.types'

/** Props accepted by `WeekPickerInput`. */
export interface WeekPickerInputProps
  extends Omit<WeekPickerProps, 'modelValue' | 'defaultValue'>, PickerInputBaseProps {
  /** Controlled value, first day of the selected week in `YYYY-MM-DD` format */
  modelValue?: DatePickerValueType
  /** Uncontrolled default value */
  defaultValue?: DatePickerValueType
  /** `dayjs` format for the first and the last day of the week displayed in the input @default 'MMM D, YYYY' */
  valueFormat?: string
  /** Separator between the first and the last day of the week and between range values @default '–' */
  labelSeparator?: string
  /** Custom displayed value formatter, by default displays the first and the last day of the week */
  valueFormatter?: DateFormatter
  /** Determines whether the dropdown is closed when week is selected, not applicable with `type="multiple"` @default true */
  closeOnChange?: boolean
}
