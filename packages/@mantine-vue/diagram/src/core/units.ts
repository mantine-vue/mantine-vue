import type { DiagramLengthUnit, DiagramScale } from './types'

/** One world unit is one centimeter unless a document defines its own scale. */
export const DEFAULT_SCALE: DiagramScale = { pixelsPerMeter: 100, unit: 'm', precision: 2 }

/** Scale of documents without one: lengths are shown in world units. */
export const PIXEL_SCALE: DiagramScale = { pixelsPerMeter: 100, unit: 'px', precision: 0 }

const METERS_PER_UNIT: Record<Exclude<DiagramLengthUnit, 'px' | 'ft-in'>, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
}

export const isImperialUnit = (unit: DiagramLengthUnit) =>
  unit === 'in' || unit === 'ft' || unit === 'ft-in'

/** Converts a length between real world units. `'ft-in'` is treated as feet. */
export function convertLength(
  value: number,
  from: Exclude<DiagramLengthUnit, 'px'>,
  to: Exclude<DiagramLengthUnit, 'px'>,
) {
  const meters = value * METERS_PER_UNIT[from === 'ft-in' ? 'ft' : from]

  return meters / METERS_PER_UNIT[to === 'ft-in' ? 'ft' : to]
}

/** Converts world units to meters. */
export const worldToMeters = (value: number, scale: DiagramScale = DEFAULT_SCALE) =>
  value / scale.pixelsPerMeter

/** Converts meters to world units. */
export const metersToWorld = (value: number, scale: DiagramScale = DEFAULT_SCALE) =>
  value * scale.pixelsPerMeter

/** Converts a length in world units to the display unit of the scale. */
export function worldToUnit(value: number, scale: DiagramScale = DEFAULT_SCALE) {
  if (scale.unit === 'px') {
    return value
  }

  return convertLength(worldToMeters(value, scale), 'm', scale.unit)
}

/** Converts a length in the display unit of the scale to world units. */
export function unitToWorld(value: number, scale: DiagramScale = DEFAULT_SCALE) {
  if (scale.unit === 'px') {
    return value
  }

  return metersToWorld(convertLength(value, scale.unit, 'm'), scale)
}

const trimNumber = (value: number, precision: number) => {
  const factor = 10 ** precision

  return String(Math.round(value * factor) / factor)
}

/**
 * Formats a length in world units, e.g. `'3.45 m'`, `'120 cm'` or `'11′ 4″'`.
 * Imperial `'ft-in'` lengths are rounded to the closest inch fraction of `1 / 2^precision`.
 */
export function formatLength(value: number, scale: DiagramScale = DEFAULT_SCALE) {
  const precision = scale.precision ?? 2

  if (scale.unit === 'px') {
    return `${trimNumber(value, precision)} px`
  }

  if (scale.unit === 'ft-in') {
    const totalInches = convertLength(worldToMeters(Math.abs(value), scale), 'm', 'in')
    const denominator = 2 ** Math.min(precision, 4)
    let feet = Math.floor(totalInches / 12)
    let inches = Math.round((totalInches - feet * 12) * denominator) / denominator

    if (inches >= 12) {
      feet += 1
      inches -= 12
    }

    const whole = Math.floor(inches)
    const fraction = Math.round((inches - whole) * denominator)
    const fractionText = fraction > 0 ? ` ${reduceFraction(fraction, denominator)}` : ''
    const sign = value < 0 ? '-' : ''

    return `${sign}${feet}′ ${whole}${fractionText}″`
  }

  const symbol = { mm: 'mm', cm: 'cm', m: 'm', in: '″', ft: '′' }[scale.unit]
  const amount = trimNumber(worldToUnit(value, scale), precision)

  return scale.unit === 'in' || scale.unit === 'ft' ? `${amount}${symbol}` : `${amount} ${symbol}`
}

function reduceFraction(numerator: number, denominator: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(numerator, denominator)

  return `${numerator / divisor}/${denominator / divisor}`
}

/** Formats an area in square world units, e.g. `'12.5 m²'` or `'134 ft²'`. */
export function formatArea(value: number, scale: DiagramScale = DEFAULT_SCALE) {
  const precision = scale.precision ?? 2
  const squareMeters = value / scale.pixelsPerMeter ** 2

  if (scale.unit === 'px') {
    return `${trimNumber(value, 0)} px²`
  }

  if (isImperialUnit(scale.unit)) {
    return `${trimNumber(squareMeters / 0.3048 ** 2, precision)} ft²`
  }

  if (scale.unit === 'cm' || scale.unit === 'mm') {
    return `${trimNumber(squareMeters * 10_000, 0)} cm²`
  }

  return `${trimNumber(squareMeters, precision)} m²`
}

const UNIT_PATTERN = /(-?\d+(?:[.,]\d+)?)\s*(mm|cm|m|in|inch|inches|ft|feet|foot|'|′|"|″)?/gi

/**
 * Parses lengths typed by users, e.g. `'3.5 m'`, `'120cm'`, `'11\' 4"'` or `'7 ft 2 in'`.
 * Numbers without a unit use the unit of the scale. Returns world units, `null` when invalid.
 */
export function parseLength(input: string, scale: DiagramScale = DEFAULT_SCALE): number | null {
  const text = input.trim()

  if (!text) {
    return null
  }

  let meters = 0
  let matched = false
  let consumed = ''

  for (const match of text.matchAll(UNIT_PATTERN)) {
    matched = true
    consumed += match[0]
    const amount = Number(match[1].replace(',', '.'))
    const unit = (match[2] ?? '').toLowerCase()

    if (!unit) {
      if (scale.unit === 'px') {
        return Number.isFinite(amount) ? amount : null
      }

      meters += convertLength(amount, scale.unit, 'm')
      continue
    }

    const normalized =
      unit === "'" || unit === '′' || unit === 'feet' || unit === 'foot'
        ? 'ft'
        : unit === '"' || unit === '″' || unit === 'inch' || unit === 'inches'
          ? 'in'
          : (unit as 'mm' | 'cm' | 'm' | 'in' | 'ft')
    meters += convertLength(amount, normalized, 'm')
  }

  if (!matched || consumed.replace(/\s/g, '').length !== text.replace(/\s/g, '').length) {
    return null
  }

  return Number.isFinite(meters) ? metersToWorld(meters, scale) : null
}

/** Scale where the distance `worldLength` represents `realLength` in `unit`. */
export function calibrateScale(
  worldLength: number,
  realLength: number,
  unit: Exclude<DiagramLengthUnit, 'px'>,
  base: DiagramScale = DEFAULT_SCALE,
): DiagramScale {
  if (!(worldLength > 0) || !(realLength > 0)) {
    throw new Error('[@mantine-vue/diagram] Calibration lengths must be positive')
  }

  return { ...base, pixelsPerMeter: worldLength / convertLength(realLength, unit, 'm') }
}
