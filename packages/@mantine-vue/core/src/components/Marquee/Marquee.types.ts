import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineSpacing, StylesApiProps } from '../../core'

/** Props declared by `Marquee` itself. See `MarqueeProps` for the full public type. */
export interface MarqueeOwnProps extends StylesApiProps<MarqueeProps> {
  /**
   * Reverses animation direction
   *
   * @default false
   */
  reverse?: boolean

  /**
   * Pauses animation on hover
   *
   * @default false
   */
  pauseOnHover?: boolean

  /**
   * Scroll orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Number of times children are repeated inline for seamless scrolling
   *
   * @default 4
   */
  repeat?: number

  /**
   * Animation duration in ms
   *
   * @default 100000
   */
  duration?: number

  /**
   * Gap between repeated children, key of `theme.spacing` or any valid CSS value
   *
   * @default 'md'
   */
  gap?: MantineSpacing

  /**
   * Whether to show gradient fade on edges,
   *
   * @default true
   */
  fadeEdges?: boolean

  /**
   * Color of the fade gradient,
   *
   * @default 'var(--mantine-color-body)'
   */
  fadeEdgeColor?: string

  /**
   * Size of the fade gradient,
   *
   * @default '5%'
   */
  fadeEdgeSize?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface MarqueeProps extends Omit<BoxProps, keyof MarqueeOwnProps>, MarqueeOwnProps {}

export interface MarqueeSlots {
  /** Content repeated inside the scrolling track. */
  default?: () => VNodeChild
}

export type MarqueeStylesNames = 'root' | 'content' | 'group'

export type MarqueeCssVariables = {
  root:
    | '--marquee-duration'
    | '--marquee-gap'
    | '--marquee-repeat'
    | '--marquee-fade-color'
    | '--marquee-fade-size'
}
