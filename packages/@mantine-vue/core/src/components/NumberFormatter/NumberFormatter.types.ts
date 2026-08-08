import type { HTMLAttributes } from 'vue'

export type ThousandsGroupStyle = 'thousand' | 'lakh' | 'wan' | 'none'

export interface NumberFormatterOptions {
  /** If set, negative values are allowed. @default true */
  allowNegative?: boolean

  /** Limits the number of digits displayed after the decimal point. */
  decimalScale?: number

  /** Character used as the decimal separator. @default '.' */
  decimalSeparator?: string

  /** Adds zeros after the decimal separator to match `decimalScale`. @default false */
  fixedDecimalScale?: boolean

  /** Text added before the formatted value. */
  prefix?: string

  /** Text added after the formatted value. */
  suffix?: string

  /** Defines the thousands grouping style. @default 'thousand' */
  thousandsGroupStyle?: ThousandsGroupStyle

  /** Character used to separate thousands. Passing `true` uses a comma. */
  thousandSeparator?: string | boolean
}

/** Props declared by `NumberFormatter` itself. See `NumberFormatterProps` for the full public type. */
export interface NumberFormatterOwnProps extends NumberFormatterOptions {
  /** Value to format. When omitted, the component renders nothing. */
  value?: number | string | bigint
}

export interface NumberFormatterProps
  extends Omit<HTMLAttributes, keyof NumberFormatterOwnProps>, NumberFormatterOwnProps {}
