import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, MantineRadius, StylesApiProps } from '../../core'

/** Props declared by `Timeline` itself. See `TimelineProps` for the full public type. */
export interface TimelineOwnProps extends StylesApiProps<TimelineProps> {
  /**
   * Index of the active element
   *
   * @default -1
   */
  active?: number

  /**
   * Key of `theme.colors` or any valid CSS color to control active item colors
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem
   *
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Size of the bullet
   *
   * @default 20
   */
  bulletSize?: string | number

  /**
   * Position of content relative to the bullet
   *
   * @default 'left'
   */
  align?: 'right' | 'left'

  /** Control width of the line */
  lineWidth?: string | number

  /**
   * If set, the active items direction is reversed without reversing items order
   *
   * @default false
   */
  reverseActive?: boolean

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface TimelineProps extends Omit<BoxProps, keyof TimelineOwnProps>, TimelineOwnProps {}

export interface TimelineSlots {
  default?: () => VNodeChild
}
export type TimelineStylesNames =
  | 'root'
  | 'itemBody'
  | 'itemContent'
  | 'itemBullet'
  | 'item'
  | 'itemTitle'
  | 'itemOpposite'
export type TimelineCssVariables = {
  root: '--tl-bullet-size' | '--tl-line-width' | '--tl-radius' | '--tl-color' | '--tl-icon-color'
}
