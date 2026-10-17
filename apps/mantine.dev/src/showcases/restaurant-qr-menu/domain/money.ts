import type { CurrencyCode, Money } from './types'

const fractionDigitsCache = new Map<string, number>()

/** Number of minor-unit digits for a currency (USD → 2, BHD → 3, JPY → 0). */
export function getCurrencyFractionDigits(currency: CurrencyCode): number {
  const cached = fractionDigitsCache.get(currency)
  if (cached !== undefined) {
    return cached
  }

  let digits = 2
  try {
    digits =
      new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2
  } catch {
    digits = 2
  }

  fractionDigitsCache.set(currency, digits)
  return digits
}

/** Converts a minor-unit integer to a major-unit decimal number (`1250` USD → `12.5`). */
export function toMajorUnits(amount: Money, currency: CurrencyCode): number {
  return amount / 10 ** getCurrencyFractionDigits(currency)
}

/** Converts a major-unit decimal to minor units, rounding half away from zero. */
export function toMinorUnits(amount: number, currency: CurrencyCode): Money {
  return roundMoney(amount * 10 ** getCurrencyFractionDigits(currency))
}

/** Rounds a (possibly fractional) minor-unit amount to an integer. */
export function roundMoney(amount: number): Money {
  return Math.sign(amount) * Math.round(Math.abs(amount))
}

/** Applies a percentage (as a fraction) to an amount and rounds the result. */
export function percentOf(amount: Money, rate: number): Money {
  return roundMoney(amount * rate)
}

export function sumMoney(values: Money[]): Money {
  return values.reduce((acc, value) => acc + value, 0)
}
