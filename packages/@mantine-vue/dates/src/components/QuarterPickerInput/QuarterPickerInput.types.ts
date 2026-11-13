import type { DateFormatter, DatePickerValueType, PickerInputBaseProps } from '../../types'
import type { QuarterPickerProps } from '../QuarterPicker/QuarterPicker.types'

/** Props accepted by `QuarterPickerInput`. */
export interface QuarterPickerInputProps
  extends Omit<QuarterPickerProps, 'modelValue' | 'defaultValue'>, PickerInputBaseProps {
  /** Controlled value, first day of the selected quarter in `YYYY-MM-DD` format */
  modelValue?: DatePickerValueType
  /** Uncontrolled default value */
  defaultValue?: DatePickerValueType
  /** `dayjs` format for input value @default '[Q]Q YYYY' */
  valueFormat?: string
  /** Separator between range values @default '–' */
  labelSeparator?: string
  /** Custom displayed value formatter */
  valueFormatter?: DateFormatter
  /** Determines whether the dropdown is closed when quarter is selected, not applicable with `type="multiple"` @default true */
  closeOnChange?: boolean
}
