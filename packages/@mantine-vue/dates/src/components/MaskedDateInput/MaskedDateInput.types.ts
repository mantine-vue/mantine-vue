import type { ClearSectionMode, PopoverProps } from '@mantine-vue/core'
import type { CalendarLevel, ControlProps, DateStringValue } from '../../types'
import type { MaskedDateInputPasteResult } from './use-masked-date-input'

/** Props accepted by `MaskedDateInput`. */
export interface MaskedDateInputProps {
  /** Controlled component value. `YYYY-MM-DD` format when `withTime=false`, `YYYY-MM-DD HH:mm:ss` when `withTime=true` */
  modelValue?: string | null
  /** Uncontrolled component default value */
  defaultValue?: string | null
  /** Order of date fields @default ['day', 'month', 'year'] */
  fieldsOrder?: ('day' | 'month' | 'year')[]
  /** Separator displayed between date fields @default '/' */
  dateSeparator?: string
  /** Separator displayed between time fields @default ':' */
  timeSeparator?: string
  /** Determines whether time fields (hours, minutes) are displayed @default false */
  withTime?: boolean
  /** Determines whether seconds field is displayed (requires withTime) @default false */
  withSeconds?: boolean
  /** Time format, 24h or 12h @default '24h' */
  format?: '24h' | '12h'
  /** Labels used for am/pm values @default { am: 'AM', pm: 'PM' } */
  amPmLabels?: { am: string; pm: string }
  /** Number by which hours are incremented/decremented @default 1 */
  hoursStep?: number
  /** Number by which minutes are incremented/decremented @default 1 */
  minutesStep?: number
  /** Number by which seconds are incremented/decremented @default 1 */
  secondsStep?: number
  /** Determines whether the calendar dropdown is displayed when input is focused @default true */
  withDropdown?: boolean
  /** Props passed down to Popover component */
  popoverProps?: Partial<PopoverProps> & Record<string, any>
  /** Determines whether the clear button should be displayed @default false */
  clearable?: boolean
  /** Determines how the clear button and rightSection are rendered @default 'both' */
  clearSectionMode?: ClearSectionMode
  /** If set, the value can be deselected by clicking the selected date in the calendar dropdown, `clearable` by default */
  allowDeselect?: boolean
  /** If set, the value cannot be updated @default false */
  readOnly?: boolean
  /** If set, the component becomes disabled @default false */
  disabled?: boolean
  /** `name` prop passed down to the hidden input */
  name?: string
  /** `form` prop passed down to the hidden input */
  form?: string
  /** `aria-label` of day input @default 'Day' */
  dayInputLabel?: string
  /** `aria-label` of month input @default 'Month' */
  monthInputLabel?: string
  /** `aria-label` of year input @default 'Year' */
  yearInputLabel?: string
  /** `aria-label` of hours input @default 'Hours' */
  hoursInputLabel?: string
  /** `aria-label` of minutes input @default 'Minutes' */
  minutesInputLabel?: string
  /** `aria-label` of seconds input @default 'Seconds' */
  secondsInputLabel?: string
  /** `aria-label` of am/pm input @default 'AM/PM' */
  amPmInputLabel?: string
  /** Props passed to day input */
  dayInputProps?: Record<string, any>
  /** Props passed to month input */
  monthInputProps?: Record<string, any>
  /** Props passed to year input */
  yearInputProps?: Record<string, any>
  /** Props passed to hours input */
  hoursInputProps?: Record<string, any>
  /** Props passed to minutes input */
  minutesInputProps?: Record<string, any>
  /** Props passed to seconds input */
  secondsInputProps?: Record<string, any>
  /** Props passed to am/pm select */
  amPmSelectProps?: Record<string, any>
  /** Props passed to clear button */
  clearButtonProps?: Record<string, any>
  /** Props passed to hidden input */
  hiddenInputProps?: Record<string, any>
  /** Day input placeholder @default '--' */
  dayPlaceholder?: string
  /** Month input placeholder @default '--' */
  monthPlaceholder?: string
  /** Year input placeholder @default '----' */
  yearPlaceholder?: string
  /** Hours input placeholder @default '--' */
  hoursPlaceholder?: string
  /** Minutes input placeholder @default '--' */
  minutesPlaceholder?: string
  /** Seconds input placeholder @default '--' */
  secondsPlaceholder?: string
  /** A function to transform pasted values */
  pasteSplit?: (value: string) => MaskedDateInputPasteResult
  /** Input label */
  label?: any
  /** Component size @default 'sm' */
  size?: string
  /** Section displayed on the right side of the input */
  rightSection?: any
  /** Locale used to format calendar labels */
  locale?: string
  /** Minimum possible date */
  minDate?: string | Date
  /** Maximum possible date */
  maxDate?: string | Date
  /** Displayed calendar date in controlled mode */
  date?: string | Date
  /** Initial displayed calendar date */
  defaultDate?: string | Date
  /** Initial calendar level @default 'month' */
  defaultLevel?: CalendarLevel
  /** Max level that user can go up to @default 'decade' */
  maxLevel?: CalendarLevel
  /** Number 0-6, where 0 – Sunday and 6 – Saturday @default 1 – Monday */
  firstDayOfWeek?: number
  /** Indices of weekend days, 0-6 */
  weekendDays?: number[]
  /** Determines whether outside dates should be hidden in the calendar @default false */
  hideOutsideDates?: boolean
  /** Determines whether a date is disabled in the calendar */
  excludeDate?: (date: DateStringValue) => boolean
  /** Passes props down to day controls */
  getDayProps?: (date: DateStringValue) => ControlProps
  /** Passes props down to month controls */
  getMonthControlProps?: (date: DateStringValue) => ControlProps
  /** Passes props down to year controls */
  getYearControlProps?: (date: DateStringValue) => ControlProps
}

/** Events emitted by `MaskedDateInput`. */
export interface MaskedDateInputEmits {
  'update:modelValue': [value: string | null]
  /** Called when value changes. Value is `null` when fields are incomplete */
  change: [value: string | null]
  /** Called once when one of the inputs is focused */
  focus: [event: FocusEvent]
  /** Called once when focus leaves all inputs */
  blur: [event: FocusEvent]
  'update:date': [date: DateStringValue]
  'date-change': [date: DateStringValue]
}

export type MaskedDateInputStylesNames =
  | 'fieldsRoot'
  | 'fieldsGroup'
  | 'field'
  | 'dateSeparator'
  | 'timeSeparator'
  | 'dropdown'
