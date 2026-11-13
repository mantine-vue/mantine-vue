export interface BuildDateStringInput {
  day: number | null
  month: number | null
  year: number | null
  hours: number | null
  minutes: number | null
  seconds: number | null
  withTime: boolean
  withSeconds: boolean
  format?: '24h' | '12h'
  amPm?: string | null
  amPmLabels?: { am: string; pm: string }
}

export interface BuildDateStringResult {
  valid: boolean
  value: string
}

export interface ParsedDateString {
  day: number | null
  month: number | null
  year: number | null
  hours: number | null
  minutes: number | null
  seconds: number | null
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

/** Builds `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss` string from individual fields. */
export function buildDateString(input: BuildDateStringInput): BuildDateStringResult {
  const invalid: BuildDateStringResult = { valid: false, value: '' }

  if (input.day === null || input.month === null || input.year === null) {
    return invalid
  }

  if (input.year < 1000) {
    return invalid
  }

  if (input.month < 1 || input.month > 12) {
    return invalid
  }

  const maxDays = new Date(input.year, input.month, 0).getDate()
  if (input.day < 1 || input.day > maxDays) {
    return invalid
  }

  if (input.withTime && (input.hours === null || input.minutes === null)) {
    return invalid
  }

  if (input.withSeconds && input.seconds === null) {
    return invalid
  }

  if (input.withTime && input.hours !== null && input.minutes !== null) {
    if (input.format !== '12h' && (input.hours < 0 || input.hours > 23)) {
      return invalid
    }
    if (input.minutes < 0 || input.minutes > 59) {
      return invalid
    }
    if (input.withSeconds && input.seconds !== null && (input.seconds < 0 || input.seconds > 59)) {
      return invalid
    }
  }

  if (input.withTime && input.format === '12h') {
    if (input.amPm == null) {
      return invalid
    }
    if (input.hours !== null && (input.hours < 1 || input.hours > 12)) {
      return invalid
    }
  }

  const datePart = `${pad(input.year, 4)}-${pad(input.month, 2)}-${pad(input.day, 2)}`

  if (!input.withTime) {
    return { valid: true, value: datePart }
  }

  let hours = input.hours!

  if (input.format === '12h') {
    const amPmLabels = input.amPmLabels || { am: 'AM', pm: 'PM' }
    if (input.amPm === amPmLabels.am) {
      hours = hours === 12 ? 0 : hours
    } else {
      hours = hours === 12 ? 12 : hours + 12
    }
  }

  const seconds = input.withSeconds ? input.seconds! : 0
  const timePart = `${pad(hours, 2)}:${pad(input.minutes!, 2)}:${pad(seconds, 2)}`

  return { valid: true, value: `${datePart} ${timePart}` }
}

/** Parses `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss` string into individual fields. */
export function parseDateString(value: string | null | undefined): ParsedDateString {
  const empty: ParsedDateString = {
    day: null,
    month: null,
    year: null,
    hours: null,
    minutes: null,
    seconds: null,
  }
  if (!value) {
    return empty
  }

  const [datePart, timePart] = value.split(' ')
  const [yearStr, monthStr, dayStr] = (datePart || '').split('-')
  const year = yearStr ? parseInt(yearStr, 10) : null
  const month = monthStr ? parseInt(monthStr, 10) : null
  const day = dayStr ? parseInt(dayStr, 10) : null

  if (
    year === null ||
    Number.isNaN(year) ||
    month === null ||
    Number.isNaN(month) ||
    day === null ||
    Number.isNaN(day)
  ) {
    return empty
  }

  if (!timePart) {
    return { day, month, year, hours: null, minutes: null, seconds: null }
  }

  const [hoursStr, minutesStr, secondsStr] = timePart.split(':')
  const hours = hoursStr ? parseInt(hoursStr, 10) : null
  const minutes = minutesStr ? parseInt(minutesStr, 10) : null
  const seconds = secondsStr ? parseInt(secondsStr, 10) : null

  return {
    day,
    month,
    year,
    hours: Number.isNaN(hours) ? null : hours,
    minutes: Number.isNaN(minutes) ? null : minutes,
    seconds: Number.isNaN(seconds) ? null : seconds,
  }
}

/** Returns number of days in month, `31` if month or year is not known. */
export function getDaysInMonth(month: number | null, year: number | null): number {
  if (month === null || year === null) {
    return 31
  }
  return new Date(year, month, 0).getDate()
}

/** Converts 24h hours value to 12h hours value and am/pm label. */
export function convertTo12h(
  hours24: number | null,
  labels: { am: string; pm: string },
): { hours12: number | null; amPm: string | null } {
  if (hours24 === null) {
    return { hours12: null, amPm: null }
  }
  if (hours24 === 0) {
    return { hours12: 12, amPm: labels.am }
  }
  if (hours24 < 12) {
    return { hours12: hours24, amPm: labels.am }
  }
  if (hours24 === 12) {
    return { hours12: 12, amPm: labels.pm }
  }
  return { hours12: hours24 - 12, amPm: labels.pm }
}
