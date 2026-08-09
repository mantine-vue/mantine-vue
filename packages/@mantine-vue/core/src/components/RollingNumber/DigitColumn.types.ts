/** Props declared by `DigitColumn` itself. */
export interface DigitColumnProps {
  /** Digit currently shown, as a single character. */
  digit: string

  /** Digit shown before the last change, used to pick the roll direction. */
  previousDigit?: string | null

  /**
   * If set, the column is a placeholder and renders no visible digit.
   *
   * @default false
   */
  empty?: boolean

  /** Direction the whole number moved in, so wrapping rolls the short way. */
  valueDirection: 'up' | 'down'

  /** Styles resolver passed down from `RollingNumber`. */
  getStyles: (selector: string, options?: any) => Record<string, any>
}
