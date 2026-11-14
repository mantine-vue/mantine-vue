import type { DateStringValue } from '../../types'
import type { QuartersListProps } from '../QuartersList/QuartersList.types'

/** Props accepted by `QuarterLevelGroup`. */
export interface QuarterLevelGroupProps extends Omit<QuartersListProps, 'year'> {
  /** Year displayed in the first column @default current year */
  year?: DateStringValue
  /** Number of columns displayed next to each other @default 1 */
  numberOfColumns?: number
  /** `dayjs` label format to display year label or a function that returns year label based on year value @default 'YYYY' */
  yearLabelFormat?: string | ((date: DateStringValue) => string)
  /** Determines whether next level button should be enabled @default true */
  hasNextLevel?: boolean
  /** Next button `aria-label` */
  nextLabel?: string
  /** Previous button `aria-label` */
  previousLabel?: string
  /** Level control `aria-label` */
  levelControlAriaLabel?: string
  /** Disables next control, calculated from `maxDate` by default */
  nextDisabled?: boolean
  /** Disables previous control, calculated from `minDate` by default */
  previousDisabled?: boolean
  /** Determines whether level select controls should be rendered as native `<select>` elements @default false */
  withNativeLevelSelect?: boolean
  /** Year range for native level select, tuple of `[startYear, endYear]` */
  yearsSelectRange?: [number, number]
  /** Disables native level select */
  disableNativeLevelSelect?: boolean
}

/** Events emitted by `QuarterLevelGroup`. */
export interface QuarterLevelGroupEmits {
  /** Emitted when a quarter is selected */
  'quarter-select': [date: DateStringValue]
  /** Emitted when the pointer enters a quarter control */
  'quarter-mouse-enter': [date: DateStringValue]
  /** Emitted when the next control is activated or arrow navigation runs off the last quarter */
  next: []
  /** Emitted when the previous control is activated or arrow navigation runs off the first quarter */
  previous: []
  /** Emitted when the level control is clicked */
  'level-click': []
  /** Emitted when the native level select changes the date */
  'date-change': [date: DateStringValue]
}
