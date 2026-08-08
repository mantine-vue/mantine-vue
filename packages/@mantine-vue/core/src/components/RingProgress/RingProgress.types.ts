import type { VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineNode, StylesApiProps } from '../../core'

export type RingProgressStylesNames = 'root' | 'svg' | 'label' | 'curve'

export type RingProgressCssVariables = {
  root: '--rp-size' | '--rp-label-offset' | '--rp-transition-duration'
  svg: '--rp-start-angle'
}

/** One arc of the ring. Extra keys are forwarded to the `circle` element. */
export interface RingProgressSection extends Record<string, any> {
  /** Portion of the ring this section covers. */
  value: number

  /** Key of `theme.colors` or any valid CSS color. */
  color?: MantineColor

  /** Accessible label for the section. */
  tooltip?: any
}

export interface RingProgressSlots {
  /** Content rendered in the middle of the ring. Takes precedence over the `label` prop. */
  label?: () => VNodeChild
}

/** Props declared by `RingProgress` itself. See `RingProgressProps` for the full public type. */
export interface RingProgressOwnProps extends StylesApiProps<RingProgressProps> {
  /**
   * Content rendered in the middle of the ring.
   * Can also be set with the `label` slot – the slot takes precedence.
   */
  label?: MantineNode

  /**
   * Thickness of the ring in px.
   *
   * @default 12
   */
  thickness?: number

  /**
   * Width and height of the ring in px.
   *
   * @default 120
   */
  size?: number

  /**
   * If set, the ends of each section are rounded.
   *
   * @default false
   */
  roundCaps?: boolean

  /** Sections the ring is divided into. */
  sections: RingProgressSection[]

  /** Key of `theme.colors` or any valid CSS color of the empty part of the ring. */
  rootColor?: MantineColor

  /** Duration of the section transition in ms. */
  transitionDuration?: number

  /** Gap between the sections in px. */
  sectionGap?: number

  /**
   * Angle the first section starts at, in degrees.
   *
   * @default 270
   */
  startAngle?: number
}

export interface RingProgressProps
  extends Omit<BoxProps, keyof RingProgressOwnProps>, RingProgressOwnProps {}
