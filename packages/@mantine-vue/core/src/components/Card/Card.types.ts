import type { VNodeChild } from 'vue'
import type { BoxProps, MantineRadius, MantineSpacing, StylesApiProps } from '../../core'

/** Props declared by `Card` itself. See `CardProps` for the full public type. */
export interface CardOwnProps extends StylesApiProps<CardProps> {
  /**
   * Root element or component rendered by `Card`.
   *
   * @default 'div'
   */
  component?: string

  /** Key of `theme.shadows` or any valid CSS value to set `box-shadow` */
  shadow?: string

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius, numbers are converted to rem
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Adds border to the card
   *
   * @default false
   */
  withBorder?: boolean

  /**
   * Key of `theme.spacing` or any valid CSS value to set padding
   *
   * @default 'md'
   */
  padding?: MantineSpacing

  /**
   * Card orientation
   *
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

export interface CardProps extends Omit<BoxProps, keyof CardOwnProps>, CardOwnProps {}

export interface CardSlots {
  default?: () => VNodeChild
}
export type CardStylesNames = 'root' | 'section'
export type CardCssVariables = { root: '--card-padding' }
