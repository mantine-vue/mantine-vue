import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps } from '../../core'

export type SemiCircleProgressStylesNames =
  | 'root'
  | 'svg'
  | 'emptySegment'
  | 'filledSegment'
  | 'label'

/** Props declared by `SemiCircleProgress` itself. See `SemiCircleProgressProps` for the full public type. */
export interface SemiCircleProgressOwnProps extends StylesApiProps<SemiCircleProgressProps> {
  /** Progress value from `0` to `100` */
  value: number

  /**
   * Width of the component and diameter of the full circle in px. The visible SVG height will be size/2
   *
   * @default 200
   */
  size?: number

  /**
   * Stroke width of the circle segments in px
   *
   * @default 12
   */
  thickness?: number

  /**
   * Orientation of the circle
   *
   * @default 'up'
   */
  orientation?: 'up' | 'down'

  /**
   * Direction from which the circle is filled
   *
   * @default 'left-to-right'
   */
  fillDirection?: 'right-to-left' | 'left-to-right'

  /**
   * Key of `theme.colors` or any valid CSS color value
   *
   * @default theme.primaryColor
   */
  filledSegmentColor?: string

  /**
   * Key of `theme.colors` or any valid CSS color value
   *
   * @default 'gray.2' in light mode, 'dark.4' in dark mode
   */
  emptySegmentColor?: string

  /**
   * Transition duration for the filled segment progress changes in ms. Does not affect color transitions
   *
   * @default 0
   */
  transitionDuration?: number

  /** Label rendered inside the circle */
  label?: MantineNode

  /**
   * Label position relative to the circle center
   *
   * @default 'bottom'
   */
  labelPosition?: 'center' | 'bottom'
}

export interface SemiCircleProgressSlots {
  /** Progress label. Used when the `label` prop is not set. */
  label?: () => VNodeChild
}

export interface SemiCircleProgressProps
  extends Omit<BoxProps, keyof SemiCircleProgressOwnProps>, SemiCircleProgressOwnProps {}
