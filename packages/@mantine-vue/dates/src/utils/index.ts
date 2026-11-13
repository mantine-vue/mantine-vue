import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import type {
  ControlKeydownPayload,
  GridDirection,
  GridEdge,
  DateFormatter,
  DatePickerType,
  DatePickerValueType,
  DatesRangeValue,
  DateStringValue,
} from '../types'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek)

export function toDateString(value: Date | string | null | undefined): DateStringValue | null {
  if (value == null || value === '') return null
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}

/** Compatibility helper. Date values are already timezone-independent ISO strings in v3. */
export function shiftTimezone<T>(direction: 'add' | 'remove', date: T, timezone?: string): T {
  void direction
  void timezone
  return date
}

/** Returns the browser offset for a date; `timezone` is retained for API compatibility. */
export function getTimezoneOffset(date: Date | string, timezone?: string) {
  void timezone
  return new Date(date).getTimezoneOffset()
}

export function clampDate(date: DateStringValue, minDate?: Date | string, maxDate?: Date | string) {
  const value = dayjs(date),
    min = toDateString(minDate),
    max = toDateString(maxDate)
  if (min && value.isBefore(min, 'day')) return min
  if (max && value.isAfter(max, 'day')) return max
  return value.format('YYYY-MM-DD')
}

export function getDefaultClampedDate({
  minDate,
  maxDate,
  defaultDate,
}: { minDate?: Date | string; maxDate?: Date | string; defaultDate?: Date | string } = {}) {
  return clampDate(toDateString(defaultDate) || dayjs().format('YYYY-MM-DD'), minDate, maxDate)
}

export function assignTime(date: Date | string, time: Date | string) {
  const value = dayjs(time)
  return dayjs(date)
    .hour(value.hour())
    .minute(value.minute())
    .second(value.second())
    .millisecond(value.millisecond())
    .toDate()
}

export function getFormattedDate({
  date,
  format = 'MMMM D, YYYY',
  locale,
}: {
  date: Date | string
  format?: string
  locale?: string
}) {
  return dayjs(date)
    .locale(locale || 'en')
    .format(format)
}

export function isSameDate(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined,
) {
  return !!a && !!b && dayjs(a).isSame(b, 'day')
}
export function isSameMonth(a: Date | string, b: Date | string) {
  return dayjs(a).isSame(b, 'month')
}
export function isSameYear(a: Date | string, b: Date | string) {
  return dayjs(a).isSame(b, 'year')
}
export function getStartOfWeek(date: Date | string, firstDayOfWeek = 1) {
  const value = dayjs(date)
  return value.subtract((value.day() - firstDayOfWeek + 7) % 7, 'day').format('YYYY-MM-DD')
}
export function getEndOfWeek(date: Date | string, firstDayOfWeek = 1) {
  return dayjs(getStartOfWeek(date, firstDayOfWeek)).add(6, 'day').format('YYYY-MM-DD')
}
/**
 * Returns ISO week number. Accepts a date or a week row (array of dates),
 * for week rows the Monday of the row is used, same as in `Month` week numbers.
 */
export function getWeekNumber(date: Date | string | (Date | string)[]) {
  if (Array.isArray(date)) {
    const monday = date.find((item) => dayjs(item).day() === 1) ?? date[0]
    return dayjs(monday).isoWeek()
  }
  return dayjs(date).isoWeek()
}

export function handleControlKeyDown({
  rowIndex,
  cellIndex,
  event,
  controlsRef,
  onEdgeCross,
  dir = 'ltr',
}: ControlKeydownPayload) {
  const direction = keyToDirection(event.key, dir)
  if (direction) {
    event.preventDefault()
    const edge = focusAdjacentControl(controlsRef, rowIndex, cellIndex, direction)
    if (edge) onEdgeCross?.({ edge, direction, cellIndex })
    return
  }
  const rows = controlsRef.length,
    cols = controlsRef[rowIndex]?.length || 0
  if (event.key === 'Home' || event.key === 'End') {
    const next = controlsRef[rowIndex]?.[event.key === 'Home' ? 0 : cols - 1]
    if (next && rows) {
      event.preventDefault()
      next.focus()
    }
  }
}

function isGridControlFocusable(element: HTMLElement | null | undefined) {
  return (
    !!element &&
    !(element as any).disabled &&
    !element.hasAttribute('data-hidden') &&
    !element.hasAttribute('data-outside')
  )
}

/**
 * Moves focus to the next focusable control of a two-dimensional grid in the given direction.
 * Returns the crossed grid edge when there is no focusable control left in that direction.
 */
export function focusAdjacentControl(
  refs: (HTMLElement | null | undefined)[][],
  rowIndex: number,
  cellIndex: number,
  direction: GridDirection,
): GridEdge | null {
  let row = rowIndex,
    cell = cellIndex
  for (let index = 0; index < 100; index += 1) {
    if (direction === 'up') row -= 1
    if (direction === 'down') row += 1
    if (direction === 'left' && --cell < 0) {
      row -= 1
      cell = (refs[row]?.length || 1) - 1
    }
    if (direction === 'right' && ++cell >= (refs[row]?.length || 0)) {
      row += 1
      cell = 0
    }
    if (row < 0) return 'previous'
    const element = refs[row]?.[cell]
    if (!element) return direction === 'up' || direction === 'left' ? 'previous' : 'next'
    if (isGridControlFocusable(element)) {
      element.focus()
      return null
    }
  }
  return null
}

/**
 * Focuses the control at the given position (`'last'` resolves to the last row or cell),
 * falls back to the next focusable control in the given direction.
 */
export function focusGridControl(
  refs: (HTMLElement | null | undefined)[][],
  direction: GridDirection,
  rowIndex: number | 'last',
  cellIndex: number | 'last',
) {
  const rows = refs.filter(Boolean)
  if (rows.length === 0) return
  let row = rowIndex === 'last' ? rows.length - 1 : Math.min(rowIndex, rows.length - 1)
  if (
    rowIndex === 'last' &&
    typeof cellIndex === 'number' &&
    row > 0 &&
    cellIndex >= (refs[row]?.length || 0)
  )
    row -= 1
  const cells = refs[row] || []
  const cell = cellIndex === 'last' ? cells.length - 1 : Math.min(cellIndex, cells.length - 1)
  const element = cells[cell]
  if (!element) return
  if (isGridControlFocusable(element)) element.focus()
  else focusAdjacentControl(refs, row, cell, direction)
}

/** Returns the first day of the quarter that contains the given date in `YYYY-MM-DD` format. */
export function getQuarterStart(date: DateStringValue | Date): DateStringValue {
  return dayjs(date).startOf('quarter').format('YYYY-MM-DD')
}

export function keyToDirection(key: string, dir: 'ltr' | 'rtl' = 'ltr'): GridDirection | null {
  return key === 'ArrowUp'
    ? 'up'
    : key === 'ArrowDown'
      ? 'down'
      : key === 'ArrowLeft'
        ? dir === 'rtl'
          ? 'right'
          : 'left'
        : key === 'ArrowRight'
          ? dir === 'rtl'
            ? 'left'
            : 'right'
          : null
}
export function setGridRef(
  refs: (HTMLElement | null | undefined)[][],
  rowIndex: number,
  cellIndex: number,
  node: any,
) {
  if (!refs[rowIndex]) refs[rowIndex] = []
  refs[rowIndex][cellIndex] = node?.$el ?? node ?? undefined
}

export function getMonthDays(
  month: DateStringValue,
  firstDayOfWeek: number,
  consistentWeeks = false,
) {
  const startOfMonth = dayjs(month).startOf('month'),
    start = dayjs(getStartOfWeek(startOfMonth.format('YYYY-MM-DD'), firstDayOfWeek))
  const offset = (startOfMonth.day() - firstDayOfWeek + 7) % 7
  const weeks = consistentWeeks ? 6 : Math.ceil((startOfMonth.daysInMonth() + offset) / 7)
  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (__, day) => start.add(week * 7 + day, 'day').format('YYYY-MM-DD')),
  )
}

export function isBeforeMin(date: DateStringValue, minDate?: Date | string) {
  const min = toDateString(minDate)
  return !!min && dayjs(date).isBefore(min, 'day')
}
export function isAfterMax(date: DateStringValue, maxDate?: Date | string) {
  const max = toDateString(maxDate)
  return !!max && dayjs(date).isAfter(max, 'day')
}
export function getMonthLabel(date: DateStringValue, format = 'MMMM YYYY', locale?: string) {
  return dayjs(date)
    .locale(locale || 'en')
    .format(format)
}
export function getYearRange(date: DateStringValue) {
  const year = dayjs(date).year(),
    start = year - (year % 10)
  return Array.from({ length: 10 }, (_, index) =>
    dayjs(date)
      .year(start + index)
      .startOf('year')
      .format('YYYY-MM-DD'),
  )
}
export function getDecadeLabel(date: DateStringValue) {
  const years = getYearRange(date)
  return `${dayjs(years[0]).year()} – ${dayjs(years.at(-1)!).year()}`
}

export function formatValue(
  value: DatePickerValueType,
  type: DatePickerType,
  format: string,
  locale?: string,
  labelSeparator = '–',
  valueFormatter?: DateFormatter,
) {
  if (valueFormatter) return valueFormatter({ type, date: value, locale, format, labelSeparator })
  const print = (item: string) =>
    dayjs(item)
      .locale(locale || 'en')
      .format(format)
  if (type === 'multiple')
    return Array.isArray(value)
      ? value
          .map((item) => item && print(item))
          .filter(Boolean)
          .join(', ')
      : ''
  if (type === 'range') {
    const [start, end] = Array.isArray(value) ? (value as DatesRangeValue) : [null, null]
    if (!start && !end) return ''
    if (start && !end) return `${print(start)} ${labelSeparator} `
    if (!start && end) return `${labelSeparator} ${print(end)}`
    return `${print(start!)} ${labelSeparator} ${print(end!)}`
  }
  return value ? print(value as string) : ''
}

export function isInRangeGranular(
  date: DateStringValue,
  range: [DateStringValue, DateStringValue],
  unit: 'month' | 'year',
) {
  const sorted = [...range].sort((a, b) => (dayjs(a).isAfter(b) ? 1 : -1))
  return !dayjs(date).isBefore(sorted[0], unit) && !dayjs(date).isAfter(sorted[1], unit)
}
export function getNextPickerValue(
  value: DatePickerValueType,
  date: DateStringValue,
  type: DatePickerType,
  sortDates = true,
) {
  if (type === 'multiple') {
    const next = Array.isArray(value) ? [...(value as DateStringValue[])] : []
    const index = next.findIndex((item) => isSameDate(item, date))
    if (index >= 0) next.splice(index, 1)
    else next.push(date)
    return sortDates ? next.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf()) : next
  }
  if (type === 'range') {
    const [start, end] = Array.isArray(value) ? (value as DatesRangeValue) : [null, null]
    return !start || end || dayjs(date).isBefore(start, 'day')
      ? ([date, null] as DatesRangeValue)
      : ([start, date] as DatesRangeValue)
  }
  return date
}

export function dateStringParser(value: string, format = 'MMMM D, YYYY', locale?: string) {
  const parsed = dayjs(value, format, locale || 'en', true)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}
export function isDateValid({
  date,
  minDate,
  maxDate,
}: {
  date: string
  minDate?: string | Date
  maxDate?: string | Date
}) {
  const parsed = dayjs(date)
  return (
    parsed.isValid() &&
    !isBeforeMin(parsed.format('YYYY-MM-DD'), minDate) &&
    !isAfterMax(parsed.format('YYYY-MM-DD'), maxDate)
  )
}

const splitTimeString = (value = '') => {
  const [time = ''] = value.split(' '),
    [hours = '00', minutes = '00', seconds = '00'] = time.split(':')
  return { hours, minutes, seconds }
}
export function padTime(value: number | string) {
  return String(value).padStart(2, '0')
}
const defaultAmPmLabels = { am: 'AM', pm: 'PM' }
export function getParsedTime({
  time,
  format,
  amPmLabels = defaultAmPmLabels,
}: {
  time: string
  format: '12h' | '24h'
  amPmLabels?: { am: string; pm: string }
}) {
  if (!time) return { hours: null, minutes: null, seconds: null, amPm: null }
  const parts = splitTimeString(time),
    hours = Number(parts.hours),
    minutes = Number(parts.minutes),
    seconds = Number(parts.seconds)
  if (format === '12h')
    return {
      hours: hours % 12 || 12,
      minutes,
      seconds,
      amPm: hours >= 12 ? amPmLabels.pm : amPmLabels.am,
    }
  return { hours, minutes, seconds, amPm: null }
}
export function getTimeString({
  hours,
  minutes,
  seconds,
  format = '24h',
  withSeconds = false,
  amPm = null,
  amPmLabels = defaultAmPmLabels,
}: {
  hours: number | null
  minutes: number | null
  seconds?: number | null
  format?: '12h' | '24h'
  withSeconds?: boolean
  amPm?: string | null
  amPmLabels?: { am: string; pm: string }
}) {
  if (hours === null || minutes === null || (withSeconds && seconds == null))
    return { valid: false, value: '' }
  let normalized = hours
  if (format === '12h') {
    if (amPm === null) return { valid: false, value: '' }
    if (amPm === amPmLabels.pm && hours !== 12) normalized += 12
    else if (amPm === amPmLabels.am && hours === 12) normalized = 0
  }
  return {
    valid: true,
    value: `${padTime(normalized)}:${padTime(minutes)}${withSeconds ? `:${padTime(seconds || 0)}` : ''}`,
  }
}
export function timeToSeconds(value: string) {
  const { hours, minutes, seconds } = splitTimeString(value)
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds || 0)
}
export function isSameTime(a?: string, b?: string) {
  return !!a && !!b && timeToSeconds(a) === timeToSeconds(b)
}
export function compareTime(a: string, b: string) {
  return timeToSeconds(a) - timeToSeconds(b)
}
export function clampTime(value: string, min?: string, max?: string) {
  if (min && compareTime(value, min) < 0) return min
  if (max && compareTime(value, max) > 0) return max
  return value
}
export function getTimeRange(start: string, end: string, step = 60) {
  const result: string[] = []
  for (let current = timeToSeconds(start); current <= timeToSeconds(end); current += step)
    result.push(
      `${padTime(Math.floor(current / 3600))}:${padTime(Math.floor((current % 3600) / 60))}`,
    )
  return result
}
export const getFormattedTime = ({
  value,
  format = 'HH:mm',
}: {
  value: string | Date
  format?: string
}) => (value instanceof Date ? dayjs(value) : dayjs(`2024-01-01 ${value}`)).format(format)
