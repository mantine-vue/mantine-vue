import type { NumberFormatterOptions } from '../NumberFormatter'
import type { NumberInputValue } from './NumberInput.types'

/**
 * Pure value handling for `NumberInput`.
 *
 * Kept apart from the component: the parsing, clamping and caret rules are the bulk of
 * the logic, are entirely independent of Vue, and are far easier to reason about — and
 * to test — on their own.
 */

const leadingDecimalZeroPattern = /^(0\.0*|-0(\.0*)?)$/
const leadingZerosPattern = /^-?0\d+(\.\d+)?\.?$/
const trailingZerosPattern = /\.\d*0$/
const trailingDecimalSeparatorPattern = /^-?\d+\.$/

export function clamp(value: number, min?: number, max?: number) {
  return Math.min(max ?? value, Math.max(min ?? value, value))
}

export function clampBigInt(value: bigint, min?: bigint, max?: bigint) {
  if (min !== undefined && value < min) {
    return min
  }

  if (max !== undefined && value > max) {
    return max
  }

  return value
}

export function stripFormatting(value: string, options: NumberFormatterOptions) {
  let next = value

  if (options.prefix && next.startsWith(options.prefix)) {
    next = next.slice(options.prefix.length)
  }

  if (options.suffix) {
    next = next.split(options.suffix).join('')
  }

  const separator = options.thousandSeparator === true ? ',' : options.thousandSeparator

  if (separator) {
    next = next.split(String(separator)).join('')
  }

  if (options.decimalSeparator && options.decimalSeparator !== '.') {
    next = next.replace(options.decimalSeparator, '.')
  }

  return next.trim()
}

export function parseNumberInputValue(
  rawValue: string,
  allowDecimal: boolean,
  allowNegative: boolean,
  allowLeadingZeros: boolean,
  decimalScale?: number,
  fixedDecimalScale?: boolean,
): NumberInputValue {
  let normalized = rawValue

  if (!allowNegative) {
    normalized = normalized.replace(/-/g, '')
  }

  if (!allowDecimal) {
    normalized = normalized.split('.')[0]
  }

  if (allowDecimal && typeof decimalScale === 'number' && normalized.includes('.')) {
    const [integerPart, decimalPart = ''] = normalized.split('.')
    normalized = `${integerPart}.${decimalPart.slice(0, decimalScale)}`
  }

  if (normalized === '' || (allowNegative && normalized === '-') || normalized.endsWith('.')) {
    return normalized
  }

  if (fixedDecimalScale && typeof decimalScale === 'number' && normalized.includes('.')) {
    const [, decimalPart = ''] = normalized.split('.')

    if (decimalPart.length < decimalScale) {
      return normalized
    }
  }

  if (trailingZerosPattern.test(normalized) || leadingDecimalZeroPattern.test(normalized)) {
    return normalized
  }

  if (allowLeadingZeros && leadingZerosPattern.test(normalized)) {
    return normalized
  }

  const parsed = Number(normalized)

  if (Number.isNaN(parsed) || Math.abs(parsed) > Number.MAX_SAFE_INTEGER) {
    return normalized
  }

  return parsed
}

export function sanitizeNumberInputString(
  rawValue: string,
  allowDecimal: boolean,
  allowNegative: boolean,
  decimalScale?: number,
) {
  let normalized = rawValue

  if (!allowNegative) {
    normalized = normalized.replace(/-/g, '')
  }

  if (!allowDecimal) {
    return normalized.split('.')[0]
  }

  if (typeof decimalScale === 'number' && normalized.includes('.')) {
    const [integerPart, decimalPart = ''] = normalized.split('.')
    return `${integerPart}.${decimalPart.slice(0, decimalScale)}`
  }

  return normalized
}

export function clampAndSanitizeInput(sanitizedValue: string | number, max?: number, min?: number) {
  const stringValue = sanitizedValue.toString()
  const hasTrailingDecimalSeparator = trailingDecimalSeparatorPattern.test(stringValue)
  const replaced = stringValue.replace(/^0+(?=\d)/, '')
  const parsedValue = parseFloat(replaced)

  if (Number.isNaN(parsedValue)) {
    return replaced
  }

  if (parsedValue > Number.MAX_SAFE_INTEGER) {
    return max !== undefined ? max : replaced
  }

  const clamped = clamp(parsedValue, min, max)

  if (hasTrailingDecimalSeparator) {
    const clampedString = clamped.toString().replace(/^0+(?=\d)/, '')
    return `${clampedString}.`
  }

  return clamped
}

export function isInRange(
  value: number | undefined,
  min: number | undefined,
  max: number | undefined,
) {
  if (value === undefined) {
    return true
  }

  const minValid = min === undefined || value >= min
  const maxValid = max === undefined || value <= max

  return minValid && maxValid
}

export function isStrictAllowed(value: NumberInputValue, min?: number, max?: number) {
  if (value === '' || value === '-') {
    return true
  }

  if (typeof value === 'bigint') {
    return true
  }

  const parsed = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(parsed)) {
    return true
  }

  return isInRange(parsed, min, max)
}

export function restoreInputValue(input: HTMLInputElement, value: string) {
  input.value = value
}

export function getCaretBoundaries(value: string, options: NumberFormatterOptions) {
  const min = options.prefix && value.startsWith(options.prefix) ? options.prefix.length : 0
  const max =
    options.suffix && value.endsWith(options.suffix)
      ? value.length - options.suffix.length
      : value.length

  return { min, max }
}

export function clampCaretPosition(position: number, min: number, max: number) {
  return Math.min(max, Math.max(min, position))
}

export function parseBigIntInputValue(
  rawValue: string,
  allowNegative: boolean,
  allowLeadingZeros: boolean,
) {
  const normalized = allowNegative ? rawValue : rawValue.replace(/-/g, '')

  if (normalized === '' || (allowNegative && normalized === '-')) {
    return normalized
  }

  if (!/^-?\d+$/.test(normalized) || (allowLeadingZeros && leadingZerosPattern.test(normalized))) {
    return rawValue
  }

  try {
    return BigInt(normalized)
  } catch {
    return normalized
  }
}

export function toNumeric(value: NumberInputValue | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'bigint') {
    return value
  }

  if (typeof value === 'string' && value !== '' && value !== '-') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}

export function getDecimalPlaces(value: number | string) {
  const match = String(value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
  return Math.max(0, (match?.[1]?.length || 0) - (match?.[2] ? Number(match[2]) : 0))
}
