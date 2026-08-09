import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineSize, StylesApiProps } from '../../core'

/** Props declared by `Burger` itself. See `BurgerProps` for the full public type. */
export interface BurgerOwnProps extends StylesApiProps<BurgerProps> {
  /**
   * Controls burger `width` and `height`, numbers are converted to rem
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /** Controls height of lines, by default calculated based on `size` prop */
  lineSize?: string | number

  /** Key of `theme.colors` of any valid CSS value, by default `theme.white` in dark color scheme and `theme.black` in light */
  color?: MantineColor

  /**
   * State of the burger, when `true` burger is transformed into X
   *
   * @default false
   */
  opened?: boolean

  /**
   * `transition-duration` property value in ms
   *
   * @default 300
   */
  transitionDuration?: number

  /**
   * `transition-timing-function` property value
   *
   * @default 'ease'
   */
  transitionTimingFunction?: string
}

export interface BurgerProps extends Omit<BoxProps, keyof BurgerOwnProps>, BurgerOwnProps {}

export interface BurgerSlots {
  /** Additional content rendered after the burger icon. */
  default?: () => VNodeChild
}

export type BurgerStylesNames = 'root' | 'burger'

export type BurgerCssVariables = {
  root:
    | '--burger-color'
    | '--burger-size'
    | '--burger-line-size'
    | '--burger-transition-duration'
    | '--burger-transition-timing-function'
}
