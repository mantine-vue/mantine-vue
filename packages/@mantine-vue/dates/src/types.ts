import type { CSSProperties, VNodeChild } from 'vue'
import type { MantineSize } from '@mantine-vue/core'
import classes from './Dates.module.css'

/** ISO date string in `YYYY-MM-DD` format. */
export type DateStringValue = string
/** Single picker value. */
export type DateValue = DateStringValue | null
/** Inclusive range represented by start and end dates. */
export type DatesRangeValue = [DateValue, DateValue]
/** Supported date picker selection modes. */
export type DatePickerType = 'default' | 'multiple' | 'range'
/** Calendar drill-down level. */
export type CalendarLevel = 'month' | 'year' | 'decade'
/** Value inferred from the picker selection mode. */
export type DatePickerValue<Type extends DatePickerType = 'default'> = Type extends 'range'
  ? DatesRangeValue
  : Type extends 'multiple'
    ? DateStringValue[]
    : DateValue
/** Union accepted by picker primitives. */
export type DatePickerValueType = DateValue | DateStringValue[] | DatesRangeValue
/** Keyboard navigation payload for a two-dimensional control grid. */
export interface ControlKeydownPayload {
  rowIndex: number
  cellIndex: number
  event: KeyboardEvent
  controlsRef: HTMLElement[][]
}
/** User-supplied attributes for a generated control. */
export type ControlProps = Record<string, any>
/** Render slots shared by calendar day components. */
export interface RenderDaySlots {
  renderDay?: (input: { date: DateStringValue }) => VNodeChild
  /** Short alias for `renderDay`. */
  day?: (input: { date: DateStringValue }) => VNodeChild
}
/** Date formatting callback used by picker inputs. */
export type DateFormatter = (payload: {
  type: DatePickerType
  date: DatePickerValueType
  locale?: string
  format: string
  labelSeparator: string
}) => string
/** Shared locale and calendar settings supplied by `DatesProvider`. */
export interface DatesProviderSettings {
  /** Locale used to format dates @default 'en' */
  locale?: string
  /** Number 0-6, where 0 – Sunday and 6 – Saturday @default 1 – Monday */
  firstDayOfWeek?: number
  /** Indices of weekend days, 0-6, where 0 is Sunday and 6 is Saturday @default [0, 6] */
  weekendDays?: number[]
  /** Timezone used for date calculations @default 'UTC' */
  timezone?: string
  /** Determines whether all months should have six weeks @default false */
  consistentWeeks?: boolean
}
/** Props accepted by `DatesProvider`. */
export interface DatesProviderProps {
  /** Settings inherited by all nested date components @default {} */
  settings?: DatesProviderSettings
}
/** Common style API accepted by date controls. */
export interface DatesStyleProps {
  classNames?: Record<string, string> | ((...args: any[]) => Record<string, string>)
  styles?: Record<string, CSSProperties> | ((...args: any[]) => Record<string, CSSProperties>)
  /** Removes component styles @default false */
  unstyled?: boolean
}
/** Props accepted by the low-level day control. */
export interface DayProps extends DatesStyleProps {
  /** Date represented by the control. */
  date: DateStringValue
  /** Control width and height of the day @default 'sm' */
  size?: string | number
  /** Determines which element is used as root, `'button'` by default, `'div'` if static prop is set @default false */
  static?: boolean
  /** Determines whether the day is considered to be a weekend @default false */
  weekend?: boolean
  /** Determines whether the day is outside of the current month @default false */
  outside?: boolean
  /** Determines whether the day is selected @default false */
  selected?: boolean
  /** Determines whether the day should not be displayed @default false */
  hidden?: boolean
  /** Determines whether the day is selected in range @default false */
  inRange?: boolean
  /** Determines whether the day is first in range selection @default false */
  firstInRange?: boolean
  /** Determines whether the day is last in range selection @default false */
  lastInRange?: boolean
  /** Determines whether today should be highlighted with a border @default false */
  highlightToday?: boolean
  /** Determines whether the day should take the full width of its cell @default false */
  fullWidth?: boolean
  /** Disables the control @default false */
  disabled?: boolean
  /** Custom day content renderer. */
  renderDay?: (date: DateStringValue) => VNodeChild
}
/** Props accepted by month/year picker controls. */
export interface PickerControlProps extends DatesStyleProps {
  /** Assigns selected styles @default false */
  selected?: boolean
  /** Disables control @default false */
  disabled?: boolean
  /** Assigns in range styles @default false */
  inRange?: boolean
  /** Assigns first in range styles @default false */
  firstInRange?: boolean
  /** Assigns last in range styles @default false */
  lastInRange?: boolean
  /** Determines whether controls should be separated @default true */
  withCellSpacing?: boolean
  /** Determines whether the control should take the full width of its cell @default false */
  fullWidth?: boolean
}
/** Props accepted by the calendar navigation header. */
export interface CalendarHeaderProps extends DatesStyleProps {
  /** Header label. */
  label: string
  /** Determines whether next level button should be enabled @default true */
  hasNextLevel?: boolean
  /** Determines whether next control should be rendered @default true */
  withNext?: boolean
  /** Determines whether previous control should be rendered @default true */
  withPrevious?: boolean
  /** Disables next control @default false */
  nextDisabled?: boolean
  /** Disables previous control @default false */
  previousDisabled?: boolean
  /** Next button `aria-label` @default 'Next' */
  nextLabel?: string
  /** Previous button `aria-label` @default 'Previous' */
  previousLabel?: string
  /** Accessible label for the level control. */
  levelControlAriaLabel?: string
  /** Determines whether the header should take the full width of its container @default false */
  fullWidth?: boolean
  /** Determines whether level select controls should be rendered as native `<select>` elements @default false */
  withNativeLevelSelect?: boolean
  /** Inclusive year range shown by the native selector. */
  yearsSelectRange?: [number, number]
  /** Current calendar level. */
  calendarLevel?: CalendarLevel
  /** Date represented by the header. */
  date?: string | Date
  /** Locale used to format the label. */
  locale?: string
  /** Earliest selectable date. */
  minDate?: string | Date
  /** Latest selectable date. */
  maxDate?: string | Date
  /** Disables the native level selector @default false */
  disableNativeLevelSelect?: boolean
}
/** Events emitted by `CalendarHeader`. */
export interface CalendarHeaderEmits {
  /** Emitted when the native level selector changes the date. */
  'date-change': [date: DateStringValue]
  /** Emitted when the next control is activated. */
  next: []
  /** Emitted when the previous control is activated. */
  previous: []
  /** Emitted when the level control is activated. */
  'level-click': []
}
/** Props accepted by the weekdays table row. */
export interface WeekdaysRowProps extends DatesStyleProps {
  /** Number 0-6, 0 – Sunday, 6 – Saturday @default 1 – Monday */
  firstDayOfWeek?: number
  /** Weekday indexes treated as weekend days. */
  weekendDays?: number[]
  /** Locale used to format weekday labels. */
  locale?: string
  /** dayjs format to get weekday name @default 'dd' */
  weekdayFormat?: string | ((date: DateStringValue) => string)
  /** If set, heading for week numbers is displayed @default false */
  withWeekNumbers?: boolean
}
/** Props accepted by a rendered month grid. */
export interface MonthProps extends DatesStyleProps {
  /** Month to display, value `YYYY-MM-DD` @default current month */
  month?: DateStringValue
  /** Selected date value @default null */
  value?: DatePickerValueType
  /** Picker type: range, multiple or default @default 'default' */
  type?: DatePickerType
  /** Locale used to format dates. */
  locale?: string
  /** Number 0-6, where 0 – Sunday and 6 – Saturday @default 1 – Monday */
  firstDayOfWeek?: number
  /** Weekday indexes treated as weekend days. */
  weekendDays?: number[]
  /** `dayjs` format for weekdays names @default 'dd' */
  weekdayFormat?: string | ((date: DateStringValue) => string)
  /** Earliest selectable date. */
  minDate?: string | Date
  /** Latest selectable date. */
  maxDate?: string | Date
  /** Determines whether a date is disabled. */
  excludeDate?: (date: DateStringValue) => boolean
  /** Custom day content renderer. */
  renderDay?: (date: DateStringValue) => VNodeChild
  /** Determines whether outside dates should be hidden @default false */
  hideOutsideDates?: boolean
  /** Determines whether weekdays row should be hidden @default false */
  hideWeekdays?: boolean
  /** Returns additional props for a day control. */
  getDayProps?: (date: DateStringValue) => ControlProps
  /** Returns an accessible label for a day control. */
  getDayAriaLabel?: (date: DateStringValue) => string
  /** Determines whether controls should be separated by space @default true */
  withCellSpacing?: boolean
  /** Determines whether today should be highlighted with a border @default false */
  highlightToday?: boolean
  /** Determines whether week numbers should be displayed @default false */
  withWeekNumbers?: boolean
  /** Determines whether days should be static @default false */
  static?: boolean
  /** Determines whether the month should take the full width of its container @default false */
  fullWidth?: boolean
}
/** Events emitted by `Month`. */
export interface MonthEmits {
  /** Emitted when a day is selected. */
  'day-click': [date: DateStringValue]
  /** Emitted when the pointer enters a day. */
  'day-mouse-enter': [date: DateStringValue]
}
/** Props accepted by the month selection grid. */
export interface MonthsListProps extends DatesStyleProps {
  /** Year for which months list should be displayed @default current year */
  year?: DateStringValue
  /** Selected date value. */
  value?: DatePickerValueType
  /** Earliest selectable date. */
  minDate?: string | Date
  /** Latest selectable date. */
  maxDate?: string | Date
  /** Locale used to format month labels. */
  locale?: string
  /** `dayjs` format for months list @default 'MMM' */
  monthsListFormat?: string | ((date: DateStringValue) => string)
  /** Returns additional props for a month control. */
  getMonthControlProps?: (date: DateStringValue) => ControlProps
  /** Determines whether the list should take the full width of its container @default false */
  fullWidth?: boolean
}
/** Events emitted by `MonthsList`. */
export interface MonthsListEmits {
  /** Emitted when a month is selected. */
  'month-select': [date: DateStringValue]
  /** Emitted when the pointer enters a month. */
  'month-mouse-enter': [date: DateStringValue]
}
/** Props accepted by the year selection grid. */
export interface YearsListProps extends DatesStyleProps {
  /** Decade value to display @default current decade */
  decade?: DateStringValue
  /** Selected date value. */
  value?: DatePickerValueType
  /** Earliest selectable date. */
  minDate?: string | Date
  /** Latest selectable date. */
  maxDate?: string | Date
  /** dayjs format for years list @default 'YYYY' */
  yearsListFormat?: string | ((date: DateStringValue) => string)
  /** Returns additional props for a year control. */
  getYearControlProps?: (date: DateStringValue) => ControlProps
  /** Determines whether the list should take the full width of its container @default false */
  fullWidth?: boolean
}
/** Events emitted by `YearsList`. */
export interface YearsListEmits {
  /** Emitted when a year is selected. */
  'year-select': [date: DateStringValue]
  /** Emitted when the pointer enters a year. */
  'year-mouse-enter': [date: DateStringValue]
}
/** Shared settings for calendar-level components. */
export interface CalendarProps extends MonthProps, MonthsListProps, YearsListProps {
  /** Initial displayed level (uncontrolled) @default 'month' */
  defaultLevel?: CalendarLevel
  /** Controlled calendar level. */
  level?: CalendarLevel
  /** Max level that user can go up to (decade, year, month) @default 'decade' */
  maxLevel?: CalendarLevel
  /** Min level that user can go down to (decade, year, month) @default 'month' */
  minLevel?: CalendarLevel
  /** Initial uncontrolled displayed date. */
  defaultDate?: string | Date
  /** Controlled displayed date. */
  date?: string | Date
  /** Number of columns displayed next to each other @default 1 */
  numberOfColumns?: number
  /** Number of columns advanced by navigation controls. */
  columnsToScroll?: number
  /** Locale used to format labels. */
  locale?: string
  /** dayjs label format to display month label or a function that returns month label based on month value @default 'MMMM YYYY' */
  monthLabelFormat?: string | ((date: DateStringValue) => string)
  /** dayjs label format to display year label or a function that returns year label based on year value @default 'YYYY' */
  yearLabelFormat?: string | ((date: DateStringValue) => string)
  /** Decade header formatter. */
  decadeLabelFormat?: (start: DateStringValue, end: DateStringValue) => string
  /** Determines whether level select controls should be rendered as native `<select>` elements @default false */
  withNativeLevelSelect?: boolean
  /** Inclusive year range shown by the native selector. */
  yearsSelectRange?: [number, number]
}
/** Preset displayed next to a date picker. */
export interface DatePickerPreset {
  value: DatePickerValueType
  label: string
}
/** Props accepted by date, month and year picker components. */
export interface DatePickerProps extends Omit<CalendarProps, 'value'> {
  /** Controlled selected value. */
  modelValue?: DatePickerValueType
  /** Initial uncontrolled selected value. */
  defaultValue?: DatePickerValueType
  /** Determines whether user can deselect the date by clicking on selected item, applicable only when `type="default"` @default true */
  allowDeselect?: boolean
  /** Determines whether dates values should be sorted before change emit, only applicable with `type="multiple"` @default true */
  sortDates?: boolean
  /** Preset values displayed next to the picker. */
  presets?: DatePickerPreset[]
}
/** Props accepted by `YearPicker`. */
export type YearPickerProps = DatePickerProps
/** Props accepted by `MonthPicker`. */
export type MonthPickerProps = DatePickerProps
/** Scoped slot exposed by picker input dropdown content. */
export interface PickerInputBaseSlots {
  default?: (payload: { close: () => void; open: () => void; opened: boolean }) => VNodeChild
}
/** Props accepted by the shared picker input shell. */
export interface PickerInputBaseProps extends DatesStyleProps {
  /** Formatted text displayed by the input @default '' */
  formattedValue?: string
  /** Controlled dropdown opened state. */
  dropdownOpened?: boolean
  /** Type of the dropdown @default 'popover' */
  dropdownType?: 'popover' | 'modal'
  /** Input label. */
  label?: any
  /** Placeholder displayed when no value is selected. */
  placeholder?: string
  /** If set, clear button is displayed when the component has value @default false */
  clearable?: boolean
  /** Disables the input @default false */
  disabled?: boolean
  /** Marks the input as required @default false */
  required?: boolean
  /** Error content or error state. */
  error?: any
  /** Component size @default 'sm' */
  size?: string | number
  /** Input visual variant. */
  variant?: 'default' | 'filled' | 'unstyled'
}
/** Events emitted by `PickerInputBase`. */
export interface PickerInputBaseEmits {
  /** Emitted when the target is clicked. */
  click: [event: MouseEvent]
  /** Emitted when the clear button is activated. */
  clear: []
  /** Emitted when the dropdown closes. */
  'dropdown-close': []
  /** Emitted when the dropdown opens. */
  'dropdown-open': []
}
/** Props accepted by hidden form serialization input. */
export interface HiddenDatesInputProps {
  /** Native input name. */
  name?: string
  /** Value serialized into the hidden input. */
  value?: DatePickerValueType
}
/** Props shared by picker input components. */
export interface DatePickerInputProps extends DatePickerProps, PickerInputBaseProps {
  /** `dayjs` format for input value @default 'MMMM D, YYYY' */
  valueFormat?: string
  /** Separator between range values @default '–' */
  labelSeparator?: string
  /** Custom displayed value formatter. */
  valueFormatter?: DateFormatter
  /** Determines whether the dropdown is closed when date is selected, not applicable with `type="multiple"` @default true */
  closeOnChange?: boolean
}
/** Props accepted by the free-form date text input. */
export interface DateInputProps extends PickerInputBaseProps {
  /** Controlled date value. */
  modelValue?: string | Date | null
  /** Initial uncontrolled date value. */
  defaultValue?: string | Date | null
  /** `dayjs` format to display input value @default 'MMMM D, YYYY' */
  valueFormat?: string
  /** Custom text-to-date parser. */
  dateParser?: (value: string) => DateStringValue | null
  /** Locale used to parse and format dates. */
  locale?: string
  /** Earliest allowed date. */
  minDate?: string | Date
  /** Latest allowed date. */
  maxDate?: string | Date
  /** Preset values displayed in the dropdown. */
  presets?: Array<{ value: DateValue; label: string }>
}
/** Props accepted by the native time input. */
export interface TimeInputProps extends DatesStyleProps {
  /** Determines whether seconds input should be displayed @default false */
  withSeconds?: boolean
  /** Controlled time value. */
  modelValue?: string
  /** Initial uncontrolled time value. */
  defaultValue?: string
}
/** Props accepted by the time grid. */
export interface TimeGridProps extends DatesStyleProps {
  /** Time data in 24h format to be displayed in the grid @default [] */
  data?: string[]
  /** Controlled selected time. */
  modelValue?: string
  /** Initial uncontrolled selected time. */
  defaultValue?: string
  /** Earliest selectable time. */
  minTime?: string
  /** Latest selectable time. */
  maxTime?: string
  /** Determines whether the value can be deselected when the current active option is clicked or activated with keyboard @default false */
  allowDeselect?: boolean
  /** If set, all controls are disabled @default false */
  disabled?: boolean
  /** Returns additional props for a time control. */
  getControlProps?: (value: string) => ControlProps
}
/** Props accepted by the numeric spin field used by `TimePicker`. */
export interface SpinInputProps extends DatesStyleProps {
  /** Controlled numeric value. */
  modelValue?: number | null
  /** Initial uncontrolled numeric value. */
  defaultValue?: number | null
  /** Minimum allowed value. */
  min: number
  /** Maximum allowed value. */
  max: number
  /** Amount added or subtracted by step controls @default 1 */
  step?: number
  /** Allows an intermediate zero while typing @default false */
  allowTemporaryZero?: boolean
  /** Placeholder displayed when the value is empty @default '--' */
  placeholder?: string
  /** Prevents focus from advancing after a complete value is typed @default false */
  disableAutoAdvance?: boolean
  /** Disables the input @default false */
  disabled?: boolean
  /** Makes the input read-only @default false */
  readOnly?: boolean
}
/** Events emitted by `SpinInput`. */
export interface SpinInputEmits {
  /** Emitted when focus should advance to the next input. */
  'next-input': []
  /** Emitted when focus should return to the previous input. */
  'previous-input': []
  /** Emitted when content is pasted into the input. */
  paste: [event: ClipboardEvent]
}
/** Labels used by a 12-hour time picker. */
export interface TimePickerAmPmLabels {
  am: string
  pm: string
}
/** Props accepted by the AM/PM field. */
export interface AmPmInputProps extends DatesStyleProps {
  /** Controlled period value. */
  modelValue?: string | null
  /** Initial uncontrolled period value. */
  defaultValue?: string | null
  /** Labels displayed for AM and PM @default { am: 'AM', pm: 'PM' } */
  labels?: TimePickerAmPmLabels
  /** Disables the input @default false */
  disabled?: boolean
  /** Makes the input read-only @default false */
  readOnly?: boolean
}
/** Events emitted by `AmPmInput`. */
export interface AmPmInputEmits {
  /** Emitted when focus should return to the previous input. */
  'previous-input': []
}
/** Props accepted by a scrollable list of time controls. */
export interface TimeControlsListProps extends DatesStyleProps {
  /** Minimum displayed value. */
  min: number
  /** Maximum displayed value. */
  max: number
  /** Interval between displayed values @default 1 */
  step?: number
  /** Selected value @default null */
  value?: number | null
  /** Custom control label formatter. */
  formatValue?: (value: number) => string
}
/** Events emitted by `TimeControlsList`. */
export interface TimeControlsListEmits {
  /** Emitted when a value is selected. */
  select: [value: number]
}
/** Time picker preset. */
export interface TimePickerPreset {
  value: string
  label: string
}
/** Props accepted by `TimePicker`. */
export interface TimePickerProps extends DatesStyleProps {
  /** Controlled time value. */
  modelValue?: string
  /** Initial uncontrolled time value. */
  defaultValue?: string
  /** TimePicker type, `'time'` for regular time input, `'duration'` for duration input that allows values greater than 24 hours @default 'time' */
  type?: 'time' | 'duration'
  /** Determines whether the seconds input should be displayed @default false */
  withSeconds?: boolean
  /** Minimum allowed time. */
  min?: string
  /** Maximum allowed time. */
  max?: string
  /** Time format displayed in the input @default '24h' */
  format?: '12h' | '24h'
  /** Labels used for am/pm values @default { am: 'AM', pm: 'PM' } */
  amPmLabels?: TimePickerAmPmLabels
  /** Number by which hours are incremented/decremented @default 1 */
  hoursStep?: number
  /** Number by which minutes are incremented/decremented @default 1 */
  minutesStep?: number
  /** Number by which seconds are incremented/decremented @default 1 */
  secondsStep?: number
  /** Determines whether the clear button should be displayed @default false */
  clearable?: boolean
  /** Determines whether the dropdown with time controls list should be visible when the input has focus @default false */
  withDropdown?: boolean
  /** Disables the picker @default false */
  disabled?: boolean
  /** Makes the picker read-only @default false */
  readOnly?: boolean
  /** Component size @default 'sm' */
  size?: string | number
  /** Preset time values displayed in the dropdown. */
  presets?: TimePickerPreset[]
  /** If set, the dropdown is closed when a value is selected from the presets list @default false */
  closeDropdownOnPresetSelect?: boolean
  /** Ref object populated with the hours input element. */
  hoursRef?: { value: any }
}
/** Props accepted by formatted time text. */
export interface TimeValueProps extends DatesStyleProps {
  /** Time value to format. */
  value: string | Date
  /** Output date-time format @default 'HH:mm' */
  format?: string
  /** Locale used to format the value. */
  locale?: string
}
/** Props accepted by combined date and time picker. */
export interface DateTimePickerProps extends PickerInputBaseProps {
  /** Controlled date-time value. */
  modelValue?: string | Date | null
  /** Initial uncontrolled date-time value. */
  defaultValue?: string | Date | null
  /** `dayjs` format for input value @default 'MMMM D, YYYY h:mm A' */
  valueFormat?: string
  /** If set, clear button is displayed when the component has value @default false */
  clearable?: boolean
  /** Determines whether the seconds input should be displayed @default false */
  withSeconds?: boolean
  /** Props passed to the submit button. */
  submitButtonProps?: ControlProps
  /** Determines whether the picker should take the full width of its container @default false */
  fullWidth?: boolean
}
/** Props accepted by the compact multi-day calendar. */
export interface MiniCalendarProps extends DatesStyleProps {
  /** Controlled displayed date. */
  date?: string | Date
  /** Initial uncontrolled displayed date. */
  defaultDate?: string | Date
  /** Controlled selected date. */
  modelValue?: string | Date | null
  /** Initial uncontrolled selected date. */
  defaultValue?: string | Date | null
  /** Latest selectable date. */
  maxDate?: string | Date
  /** Earliest selectable date. */
  minDate?: string | Date
  /** Number of days to display in the calendar @default 7 */
  numberOfDays?: number
  /** Dayjs format string for month label @default 'MMM' */
  monthLabelFormat?: string
  /** Returns additional props for a day control. */
  getDayProps?: (date: DateStringValue) => ControlProps
  /** Component size @default 'sm' */
  size?: MantineSize
  /** Props passed to the previous control. */
  previousControlProps?: ControlProps
  /** Props passed to the next control. */
  nextControlProps?: ControlProps
  /** Locale used to format calendar labels. */
  locale?: string
}
/** Events emitted by `MiniCalendar`. */
export interface MiniCalendarEmits {
  /** Emitted when the next control is activated. */
  next: []
  /** Emitted when the previous control is activated. */
  previous: []
}

export type DatesStylesNames = keyof typeof classes
export type PickerBaseProps = PickerInputBaseProps
export type ControlsGroupSettings = Pick<CalendarProps, 'numberOfColumns' | 'columnsToScroll'>
export type DateInputSharedProps = DateInputProps
export type CalendarSettings = CalendarProps
export type CalendarBaseProps = CalendarProps
export type CalendarAriaLabels = Record<string, string>
export type MonthLevelSettings = CalendarProps
export type YearLevelSettings = CalendarProps
export type DecadeLevelSettings = CalendarProps
export type TimePickerPresets = TimePickerPreset[]
export type TimeGridData = string[]
export type TimeGridStylesNames = DatesStylesNames
export type TimePickerStylesNames = DatesStylesNames
export type DatePickerStylesNames = DatesStylesNames
export type DatePickerInputStylesNames = DatesStylesNames
export type DateInputStylesNames = DatesStylesNames
export type CalendarStylesNames = DatesStylesNames
