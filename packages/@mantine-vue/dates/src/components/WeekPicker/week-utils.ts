import dayjs from 'dayjs'
import { getEndOfWeek, getStartOfWeek, toDateString } from '../../utils'
import type {
  DateFormatter,
  DatePickerType,
  DatePickerValueType,
  DateStringValue,
} from '../../types'

/** Normalizes any date (or list of dates) to the first day of its week. */
export function normalizeWeekValue<T>(value: T, firstDayOfWeek: number): T {
  if (value === undefined || value === null) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeWeekValue(item, firstDayOfWeek)) as T
  }

  const str = toDateString(value as any)
  if (!str || !dayjs(str).isValid()) {
    return null as T
  }

  return getStartOfWeek(str, firstDayOfWeek) as T
}

export interface WeekControlState {
  selected: boolean
  inRange: boolean
  firstInRange: boolean
  lastInRange: boolean
}

interface GetWeekControlStateInput {
  weekStart: DateStringValue
  value: DatePickerValueType
  type: DatePickerType
  hoveredWeek: DateStringValue | null
}

/** Returns selection state of the week that starts with `weekStart`. */
export function getWeekControlState({
  weekStart,
  value,
  type,
  hoveredWeek,
}: GetWeekControlStateInput): WeekControlState {
  const empty = { selected: false, inRange: false, firstInRange: false, lastInRange: false }

  if (type === 'multiple') {
    return {
      ...empty,
      selected: Array.isArray(value) && (value as DateStringValue[]).includes(weekStart),
    }
  }

  if (type === 'range') {
    const [start, end] = Array.isArray(value) ? value : [null, null]
    const selected = weekStart === start || weekStart === end
    const previewEnd = start && !end ? hoveredWeek : end

    if (!start || !previewEnd) {
      return { ...empty, selected, firstInRange: selected && !end, lastInRange: false }
    }

    const [first, last] = [start, previewEnd].sort((a, b) => (dayjs(a).isAfter(b) ? 1 : -1))
    return {
      selected,
      inRange: !dayjs(weekStart).isBefore(first, 'day') && !dayjs(weekStart).isAfter(last, 'day'),
      firstInRange: weekStart === first,
      lastInRange: weekStart === last,
    }
  }

  return { ...empty, selected: value === weekStart }
}

/** Creates formatter that displays the first and the last day of every selected week. */
export function getWeekFormatter(firstDayOfWeek: number): DateFormatter {
  return ({ type, date, locale, format, labelSeparator }) => {
    const formatDate = (value: DateStringValue | Date) =>
      dayjs(value)
        .locale(locale || 'en')
        .format(format)

    const toValidString = (value: DateStringValue | Date) => {
      const parsed = dayjs(value)
      return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
    }

    const start = (value: DateStringValue | Date) => {
      const asDateString = toValidString(value)
      return asDateString ? formatDate(getStartOfWeek(asDateString, firstDayOfWeek)) : ''
    }

    const end = (value: DateStringValue | Date) => {
      const asDateString = toValidString(value)
      return asDateString ? formatDate(getEndOfWeek(asDateString, firstDayOfWeek)) : ''
    }

    const span = (value: DateStringValue | Date) => {
      const asDateString = toValidString(value)
      return asDateString ? `${start(asDateString)} ${labelSeparator} ${end(asDateString)}` : ''
    }

    if (type === 'default') {
      return date === null || date === undefined ? '' : span(date as DateStringValue)
    }

    if (type === 'multiple') {
      return Array.isArray(date) ? (date as DateStringValue[]).map(span).join(', ') : ''
    }

    if (type === 'range' && Array.isArray(date)) {
      if (date[0] && date[1]) {
        return `${start(date[0])} ${labelSeparator} ${end(date[1])}`
      }

      if (date[0]) {
        return `${start(date[0])} ${labelSeparator} `
      }

      return ''
    }

    return ''
  }
}
