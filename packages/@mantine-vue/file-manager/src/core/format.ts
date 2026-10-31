import type { FileTimestamp } from '../types'

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/** Formats bytes with a 1024 base, as file explorers do. */
export function formatFileSize(bytes: number | undefined, locale?: string) {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return ''
  }

  const exponent =
    bytes === 0 ? 0 : Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value.toLocaleString(locale, { maximumFractionDigits: exponent === 0 ? 0 : 1 })} ${SIZE_UNITS[exponent]}`
}

export function formatFileDate(value: FileTimestamp | undefined, locale?: string) {
  if (value === undefined) {
    return ''
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })
}

/** Date and size formatting. Replaceable for applications with their own date library. */
export interface FileManagerFormatters {
  size: (bytes: number | undefined) => string
  date: (value: FileTimestamp | undefined) => string
}

export const DEFAULT_FILE_MANAGER_FORMATTERS: FileManagerFormatters = {
  size: (bytes) => formatFileSize(bytes),
  date: (value) => formatFileDate(value),
}
