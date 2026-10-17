import type { MenuCategory, OpeningWindow } from './types'

const MINUTES_PER_DAY = 24 * 60
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY

export interface ZonedTime {
  /** 0 = Sunday … 6 = Saturday */
  day: number
  /** Minutes since local midnight. */
  minutes: number
}

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export function parseTime(value: string): number {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatClock(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Day of week and minutes since midnight for `date` in `timeZone`. */
export function getZonedTime(date: Date, timeZone: string): ZonedTime {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '0'

  return {
    day: weekdayIndex[get('weekday')] ?? 0,
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  }
}

interface WeekInterval {
  start: number
  end: number
  window: OpeningWindow
}

function toWeekIntervals(windows: OpeningWindow[]): WeekInterval[] {
  return windows.map((window) => {
    const start = window.day * MINUTES_PER_DAY + parseTime(window.open)
    let end = window.day * MINUTES_PER_DAY + parseTime(window.close)
    if (end <= start) {
      end += MINUTES_PER_DAY
    }
    return { start, end, window }
  })
}

export type OpenState =
  | { open: true; closesAt: string; closesInMinutes: number; closingSoon: boolean }
  | { open: false; opensAt: string | null; opensDay: number | null; opensInMinutes: number | null }

/**
 * Resolves whether the restaurant is open at `date` and when the state changes next.
 * Handles windows that cross midnight and the Saturday → Sunday wrap.
 */
export function getOpenState(
  windows: OpeningWindow[],
  date: Date,
  timeZone: string,
  closingSoonMinutes = 30,
): OpenState {
  const zoned = getZonedTime(date, timeZone)
  const now = zoned.day * MINUTES_PER_DAY + zoned.minutes
  const intervals = toWeekIntervals(windows)

  for (const interval of intervals) {
    for (const offset of [0, -MINUTES_PER_WEEK]) {
      const start = interval.start + offset
      const end = interval.end + offset
      if (now >= start && now < end) {
        const closesInMinutes = end - now
        return {
          open: true,
          closesAt: interval.window.close,
          closesInMinutes,
          closingSoon: closesInMinutes <= closingSoonMinutes,
        }
      }
    }
  }

  let next: { interval: WeekInterval; distance: number } | null = null
  for (const interval of intervals) {
    const distance = (interval.start - now + MINUTES_PER_WEEK) % MINUTES_PER_WEEK
    if (!next || distance < next.distance) {
      next = { interval, distance }
    }
  }

  return next
    ? {
        open: false,
        opensAt: next.interval.window.open,
        opensDay: next.interval.window.day,
        opensInMinutes: next.distance,
      }
    : { open: false, opensAt: null, opensDay: null, opensInMinutes: null }
}

/** Opening windows grouped by weekday, Sunday first. */
export function groupOpeningHours(windows: OpeningWindow[]): OpeningWindow[][] {
  return Array.from({ length: 7 }, (_, day) =>
    windows
      .filter((window) => window.day === day)
      .sort((a, b) => parseTime(a.open) - parseTime(b.open)),
  )
}

/** `true` when the category can be ordered at the given time (e.g. breakfast hours). */
export function isCategoryAvailable(category: MenuCategory, date: Date, timeZone: string) {
  if (!category.availableBetween) {
    return true
  }

  const { minutes } = getZonedTime(date, timeZone)
  const from = parseTime(category.availableBetween.from)
  const to = parseTime(category.availableBetween.to)

  return from <= to ? minutes >= from && minutes < to : minutes >= from || minutes < to
}

/**
 * Builds pickup/delivery slots for the rest of the current opening window and the next one.
 * Returned values are ISO strings; labels are formatted by the UI.
 */
export function getScheduleSlots(
  windows: OpeningWindow[],
  timeZone: string,
  {
    now = new Date(),
    leadMinutes = 30,
    stepMinutes = 15,
    limit = 24,
  }: { now?: Date; leadMinutes?: number; stepMinutes?: number; limit?: number } = {},
): string[] {
  const slots: string[] = []
  const start = new Date(Math.ceil((now.getTime() + leadMinutes * 60_000) / 900_000) * 900_000)

  for (
    let cursor = start;
    slots.length < limit && cursor.getTime() - now.getTime() < 2 * 24 * 3_600_000;
    cursor = new Date(cursor.getTime() + stepMinutes * 60_000)
  ) {
    const state = getOpenState(windows, cursor, timeZone, 0)
    if (state.open && state.closesInMinutes >= stepMinutes) {
      slots.push(cursor.toISOString())
    }
  }

  return slots
}
