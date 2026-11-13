import type {
  ControlEdgeCrossPayload,
  ControlProps,
  DatesStyleProps,
  DateStringValue,
  DatePickerValueType,
} from '../../types'

/** Props accepted by the quarter selection grid. */
export interface QuartersListProps extends DatesStyleProps {
  /** Year for which quarters list should be displayed @default current year */
  year?: DateStringValue
  /** Selected value, quarters that contain the value are marked as selected */
  value?: DatePickerValueType
  /** Earliest selectable date */
  minDate?: string | Date
  /** Latest selectable date */
  maxDate?: string | Date
  /** Locale used to format quarter labels */
  locale?: string
  /** `dayjs` format for quarters list or a function that returns quarter label based on the date value @default '[Q]Q' */
  quartersListFormat?: string | ((date: DateStringValue) => string)
  /** Passes props down to quarter picker control, receives the first day of the quarter */
  getQuarterControlProps?: (date: DateStringValue) => ControlProps
  /** Determines whether controls should be separated @default true */
  withCellSpacing?: boolean
  /** Determines whether the list should take the full width of its container @default false */
  fullWidth?: boolean
}

/** Events emitted by `QuartersList`. */
export interface QuartersListEmits {
  /** Emitted when a quarter is selected, receives the first day of the quarter */
  'quarter-select': [date: DateStringValue]
  /** Emitted when the pointer enters a quarter control */
  'quarter-mouse-enter': [date: DateStringValue]
  /** Emitted when arrow navigation runs off the grid */
  'edge-cross': [payload: ControlEdgeCrossPayload]
}

export type QuartersListStylesNames =
  | 'quartersList'
  | 'quartersListCell'
  | 'quartersListRow'
  | 'quartersListControl'
