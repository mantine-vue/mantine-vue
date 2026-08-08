import type { BoxMod, BoxProps, StylesApiProps } from '../../core'

export type RollingNumberStylesNames = 'root' | 'digit' | 'digitColumn' | 'char'

export type RollingNumberCssVariables = {
  root: '--rn-duration' | '--rn-timing-function'
}

/**
 * Props declared by `RollingNumber` itself.
 * See `RollingNumberProps` for the full public type.
 */
export interface RollingNumberOwnProps extends StylesApiProps<RollingNumberProps> {
  /** Number to display. Changing it rolls the digits to the new value. */
  value: number

  /** Text rendered before the number. */
  prefix?: string

  /** Text rendered after the number. */
  suffix?: string

  /**
   * Character used to separate the decimal part.
   *
   * @default '.'
   */
  decimalSeparator?: string

  /** Character used to group thousands. `true` uses a comma. */
  thousandSeparator?: string | boolean

  /** Number of decimal places to display. */
  decimalScale?: number

  /**
   * If set, the decimal places are always shown, padded with zeros.
   *
   * @default false
   */
  fixedDecimalScale?: boolean

  /**
   * Duration of the roll animation in ms.
   *
   * @default 600
   */
  animationDuration?: number

  /**
   * `transition-timing-function` of the roll animation.
   *
   * @default 'ease'
   */
  timingFunction?: string

  /**
   * If set, digits use tabular figures so the width does not jump.
   *
   * @default true
   */
  tabularNumbers?: boolean

  /**
   * If set, the root is a live region and screen readers announce each change.
   * Otherwise the number is exposed as a single labelled image.
   *
   * @default false
   */
  withLiveRegion?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface RollingNumberProps
  extends Omit<BoxProps, keyof RollingNumberOwnProps>, RollingNumberOwnProps {}
