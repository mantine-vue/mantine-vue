import type {
  ControlProps,
  DatePickerType,
  DatePickerValueType,
  DatesStyleProps,
  DateStringValue,
} from '../../types'

/** Levels available in `QuarterPicker`. */
export type QuarterPickerLevel = 'year' | 'decade'

/** Preset displayed next to `QuarterPicker`. */
export interface QuarterPickerPreset {
  value: DatePickerValueType
  label: any
}

/** Props accepted by `QuarterPicker`. */
export interface QuarterPickerProps extends DatesStyleProps {
  /** Picker type: range, multiple or default @default 'default' */
  type?: DatePickerType
  /** Controlled value, first day of the selected quarter in `YYYY-MM-DD` format */
  modelValue?: DatePickerValueType
  /** Uncontrolled default value */
  defaultValue?: DatePickerValueType
  /** Determines whether user can deselect the quarter by clicking on selected item, applicable only when `type="default"` @default true */
  allowDeselect?: boolean
  /** Determines whether values should be sorted before change emit, only applicable with `type="multiple"` @default true */
  sortDates?: boolean
  /** Predefined values to pick from */
  presets?: QuarterPickerPreset[]
  /** Max level that user can go up to @default 'decade' */
  maxLevel?: QuarterPickerLevel
  /** Initial displayed level (uncontrolled) @default 'year' */
  defaultLevel?: QuarterPickerLevel
  /** Current displayed level (controlled) */
  level?: QuarterPickerLevel
  /** Initial displayed date in uncontrolled mode */
  defaultDate?: string | Date
  /** Displayed date in controlled mode */
  date?: string | Date
  /** Number of columns displayed next to each other @default 1 */
  numberOfColumns?: number
  /** Number of columns to scroll with next/prev buttons, same as `numberOfColumns` if not set explicitly */
  columnsToScroll?: number
  /** Minimum possible date */
  minDate?: string | Date
  /** Maximum possible date */
  maxDate?: string | Date
  /** Locale used to format labels */
  locale?: string
  /** `dayjs` format for quarters list or a function that returns quarter label @default '[Q]Q' */
  quartersListFormat?: string | ((date: DateStringValue) => string)
  /** `dayjs` label format to display year label or a function that returns year label @default 'YYYY' */
  yearLabelFormat?: string | ((date: DateStringValue) => string)
  /** `dayjs` format for years list @default 'YYYY' */
  yearsListFormat?: string | ((date: DateStringValue) => string)
  /** Decade header formatter */
  decadeLabelFormat?: (start: DateStringValue, end: DateStringValue) => string
  /** Passes props down to quarter controls */
  getQuarterControlProps?: (date: DateStringValue) => ControlProps
  /** Passes props down to year controls */
  getYearControlProps?: (date: DateStringValue) => ControlProps
  /** Determines whether controls should be separated @default true */
  withCellSpacing?: boolean
  /** Determines whether the picker should take the full width of its container @default false */
  fullWidth?: boolean
  /** Determines whether level select controls should be rendered as native `<select>` elements @default false */
  withNativeLevelSelect?: boolean
  /** Year range for native level select, tuple of `[startYear, endYear]` */
  yearsSelectRange?: [number, number]
  /** Next button `aria-label` */
  nextLabel?: string
  /** Previous button `aria-label` */
  previousLabel?: string
}

/** Events emitted by `QuarterPicker`. */
export interface QuarterPickerEmits {
  'update:modelValue': [value: DatePickerValueType]
  change: [value: DatePickerValueType]
  'update:level': [level: QuarterPickerLevel]
  'level-change': [level: QuarterPickerLevel]
  'update:date': [date: DateStringValue]
  'date-change': [date: DateStringValue]
  /** Emitted when a quarter is selected */
  'quarter-select': [date: DateStringValue]
  /** Emitted when a year is selected on decade level */
  'year-select': [date: DateStringValue]
  /** Emitted when the pointer enters a quarter control */
  'quarter-mouse-enter': [date: DateStringValue]
  /** Emitted when the pointer enters a year control */
  'year-mouse-enter': [date: DateStringValue]
}

export type QuarterPickerStylesNames =
  | 'quarterPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'quartersList'
  | 'quartersListRow'
  | 'quartersListCell'
  | 'quartersListControl'
