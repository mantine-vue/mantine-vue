import { createI18n, type I18n, type LocaleDefinition } from '../../shared/i18n'
import { toMajorUnits, getCurrencyFractionDigits } from '../domain/money'
import type { CurrencyCode, LocalizedText, Money } from '../domain/types'
import { en, type QrMenuMessages } from './locales/en'

/**
 * Supported languages. To add one: create `locales/<code>.ts` exporting a
 * `DictionaryShape<QrMenuMessages>` as default, then register it here and in
 * `LOADERS`. Menu content falls back to the restaurant's default language for
 * any text that has not been translated yet.
 */
export const LOCALES: LocaleDefinition[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr', intl: 'en-US' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', intl: 'ar' },
]

const LOADERS = {
  ar: () => import('./locales/ar'),
}

export type QrMenuI18n = I18n<QrMenuMessages>
export type { QrMenuMessages }

export function createQrMenuI18n(initialLocale?: string): QrMenuI18n {
  return createI18n<QrMenuMessages>({
    locales: LOCALES,
    source: { code: 'en', messages: en },
    loaders: LOADERS,
    initialLocale,
  })
}

/** Picks the best translation of a content value for the active locale. */
export function localizeText(
  text: LocalizedText | undefined,
  locale: string,
  fallbackLocale = 'en',
) {
  if (!text) {
    return ''
  }
  return text[locale] ?? text[fallbackLocale] ?? Object.values(text).find(Boolean) ?? ''
}

/** Locale-aware formatters bound to the active language. */
export function createFormatters(i18n: QrMenuI18n) {
  const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>()
  const intl = () => i18n.definition.value.intl

  const numberFormat = (key: string, options: Intl.NumberFormatOptions) => {
    const id = `n|${intl()}|${key}`
    let format = cache.get(id) as Intl.NumberFormat | undefined
    if (!format) {
      format = new Intl.NumberFormat(intl(), options)
      cache.set(id, format)
    }
    return format
  }

  const dateFormat = (key: string, options: Intl.DateTimeFormatOptions) => {
    const id = `d|${intl()}|${key}`
    let format = cache.get(id) as Intl.DateTimeFormat | undefined
    if (!format) {
      format = new Intl.DateTimeFormat(intl(), options)
      cache.set(id, format)
    }
    return format
  }

  return {
    price(amount: Money, currency: CurrencyCode) {
      const digits = getCurrencyFractionDigits(currency)
      return numberFormat(`price-${currency}`, {
        style: 'currency',
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(toMajorUnits(amount, currency))
    },
    number(value: number) {
      return numberFormat('number', {}).format(value)
    },
    decimal(value: number, digits = 1) {
      return numberFormat(`decimal-${digits}`, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value)
    },
    percent(rate: number) {
      return numberFormat('percent', { style: 'percent', maximumFractionDigits: 3 }).format(rate)
    },
    /** `HH:mm` clock string (restaurant local time) to a localized time. */
    clock(value: string) {
      const [hours, minutes] = value.split(':').map(Number)
      return dateFormat('clock', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(
        new Date(Date.UTC(2024, 0, 1, hours % 24, minutes)),
      )
    },
    time(value: string | Date, timeZone?: string) {
      return dateFormat(`time-${timeZone ?? 'local'}`, {
        hour: 'numeric',
        minute: '2-digit',
        timeZone,
      }).format(new Date(value))
    },
    dateTime(value: string | Date, timeZone?: string) {
      return dateFormat(`datetime-${timeZone ?? 'local'}`, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        timeZone,
      }).format(new Date(value))
    },
    date(value: string | Date) {
      return dateFormat('date', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(value),
      )
    },
    /** Weekday name for 0 (Sunday) … 6 (Saturday). */
    weekday(day: number, style: 'long' | 'short' = 'long') {
      // 2023-01-01 was a Sunday.
      return dateFormat(`weekday-${style}`, { weekday: style, timeZone: 'UTC' }).format(
        new Date(Date.UTC(2023, 0, 1 + day)),
      )
    },
  }
}

export type QrMenuFormatters = ReturnType<typeof createFormatters>
