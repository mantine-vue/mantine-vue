import type { WhatsAppInboxLabels } from '../labels'
import type { WhatsAppTimestamp } from '../types'

/**
 * Converts any accepted timestamp to a `Date`, or `null` when it cannot be parsed.
 *
 * Invalid values return `null` so callers do not render `Invalid Date` or `NaN`.
 */
export function toDate(value: WhatsAppTimestamp | undefined | null): Date | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

/** Whether two dates fall on the same calendar day in the local timezone. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Start of the calendar day, used as the grouping key of the message list. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Builds an `Intl.DateTimeFormat` and falls back to the default locale when the supplied one is
 * not recognized, so a bad locale string cannot throw inside a render.
 */
function createFormatter(locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat(locale, options)
  } catch {
    return new Intl.DateTimeFormat(undefined, options)
  }
}

/** Time of day, as shown under a message bubble. */
export function formatMessageTime(value: WhatsAppTimestamp, locale?: string): string {
  const date = toDate(value)

  if (!date) {
    return ''
  }

  return createFormatter(locale, { hour: 'numeric', minute: '2-digit' }).format(date)
}

/** Full date and time, used as the `title` and screen-reader text of a message timestamp. */
export function formatFullTimestamp(value: WhatsAppTimestamp, locale?: string): string {
  const date = toDate(value)

  if (!date) {
    return ''
  }

  return createFormatter(locale, { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

/** Day divider label: `Today`, `Yesterday`, a weekday within the last week, or a full date. */
export function formatDayLabel(
  value: WhatsAppTimestamp,
  locale?: string,
  labels?: Pick<WhatsAppInboxLabels, 'today' | 'yesterday'>,
  now: Date = new Date(),
): string {
  const date = toDate(value)

  if (!date) {
    return ''
  }

  if (isSameDay(date, now)) {
    return labels?.today ?? 'Today'
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, yesterday)) {
    return labels?.yesterday ?? 'Yesterday'
  }

  const daysApart = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000,
  )

  if (daysApart > 0 && daysApart < 7) {
    return createFormatter(locale, { weekday: 'long' }).format(date)
  }

  return createFormatter(locale, { dateStyle: 'medium' }).format(date)
}

/**
 * Timestamp of a conversation list item: the time for today, `Yesterday`, a weekday within the
 * last week, and a short date beyond that. This is what keeps the column narrow.
 */
export function formatConversationTime(
  value: WhatsAppTimestamp | undefined,
  locale?: string,
  labels?: Pick<WhatsAppInboxLabels, 'today' | 'yesterday'>,
  now: Date = new Date(),
): string {
  const date = toDate(value)

  if (!date) {
    return ''
  }

  if (isSameDay(date, now)) {
    return formatMessageTime(date, locale)
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, yesterday)) {
    return labels?.yesterday ?? 'Yesterday'
  }

  const daysApart = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000,
  )

  if (daysApart > 0 && daysApart < 7) {
    return createFormatter(locale, { weekday: 'short' }).format(date)
  }

  return createFormatter(locale, { year: '2-digit', month: 'numeric', day: 'numeric' }).format(date)
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/** Human readable file size. Used by the attachment previews and by the size validation copy. */
export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return ''
  }

  if (bytes < 1024) {
    return `${bytes} ${FILE_SIZE_UNITS[0]}`
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  )
  const value = bytes / 1024 ** exponent
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10

  return `${rounded} ${FILE_SIZE_UNITS[exponent]}`
}

/** `m:ss` duration, as shown on audio and video attachments. */
export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) {
    return ''
  }

  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remaining = total % 60
  const paddedSeconds = String(remaining).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`
  }

  return `${minutes}:${paddedSeconds}`
}
