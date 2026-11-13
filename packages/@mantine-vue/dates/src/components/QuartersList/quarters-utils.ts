import dayjs from 'dayjs'
import { getQuarterStart, toDateString } from '../../utils'
import type { ControlProps, DateStringValue } from '../../types'

/** Returns quarters of the year that contains the given date, one row with four quarters. */
export function getQuartersData(year: DateStringValue): DateStringValue[][] {
  const startOfYear = dayjs(getQuarterStart(year)).startOf('year')

  return [
    [
      startOfYear.format('YYYY-MM-DD'),
      startOfYear.add(3, 'month').format('YYYY-MM-DD'),
      startOfYear.add(6, 'month').format('YYYY-MM-DD'),
      startOfYear.add(9, 'month').format('YYYY-MM-DD'),
    ],
  ]
}

interface IsQuarterDisabledInput {
  quarter: DateStringValue
  minDate: DateStringValue | Date | undefined | null
  maxDate: DateStringValue | Date | undefined | null
}

/** Determines whether the quarter is outside of `minDate` – `maxDate` range. */
export function isQuarterDisabled({ quarter, minDate, maxDate }: IsQuarterDisabledInput): boolean {
  const min = toDateString(minDate)
  const max = toDateString(maxDate)

  if (!min && !max) {
    return false
  }

  if (min && dayjs(quarter).isBefore(getQuarterStart(min), 'day')) {
    return true
  }

  if (max && dayjs(quarter).isAfter(getQuarterStart(max), 'day')) {
    return true
  }

  return false
}

interface GetQuarterInTabOrderInput {
  quarters: DateStringValue[][]
  minDate: DateStringValue | Date | undefined | null
  maxDate: DateStringValue | Date | undefined | null
  getQuarterControlProps: ((quarter: DateStringValue) => ControlProps | undefined) | undefined
  isSelected?: (quarter: DateStringValue) => boolean
}

/** Returns the quarter that should be in the tab order. */
export function getQuarterInTabOrder({
  quarters,
  minDate,
  maxDate,
  getQuarterControlProps,
  isSelected,
}: GetQuarterInTabOrderInput): DateStringValue | undefined {
  const enabledQuarters = quarters
    .flat()
    .filter(
      (quarter) =>
        !isQuarterDisabled({ quarter, minDate, maxDate }) &&
        !getQuarterControlProps?.(quarter)?.disabled,
    )

  const selectedQuarter = enabledQuarters.find(
    (quarter) => getQuarterControlProps?.(quarter)?.selected ?? isSelected?.(quarter),
  )

  if (selectedQuarter) {
    return selectedQuarter
  }

  const currentQuarterStart = getQuarterStart(new Date())
  const currentQuarter = enabledQuarters.find((quarter) => quarter === currentQuarterStart)

  if (currentQuarter) {
    return currentQuarter
  }

  return enabledQuarters[0]
}

/** Normalizes any date (or list of dates) to the first day of its quarter. */
export function normalizeQuarterValue<T>(value: T): T {
  if (value === undefined || value === null) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeQuarterValue(item)) as T
  }

  const str = toDateString(value as any)
  if (!str || !dayjs(str).isValid()) {
    return null as T
  }

  return getQuarterStart(str) as T
}
