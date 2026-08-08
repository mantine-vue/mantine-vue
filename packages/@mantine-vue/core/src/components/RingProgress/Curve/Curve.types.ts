import type { BoxProps, MantineColor } from '../../../core'

/** Props declared by the ring progress `Curve` itself. */
export interface RingProgressCurveOwnProps {
  /** Portion of the ring this segment covers, as a percentage of `sum`. */
  value?: number

  /** Diameter of the ring in px. */
  size: number

  /** Percentage the segment starts at, measured from the top. */
  offset: number

  /** Total of every segment's value, used to scale the arc. */
  sum: number

  /** Thickness of the ring in px. */
  thickness: number

  /** If set, the ends of the segment are rounded. */
  lineRoundCaps?: boolean

  /**
   * If set, this is the background ring rather than a value segment.
   *
   * @default false
   */
  root?: boolean

  /** Key of `theme.colors` or any valid CSS color of the segment. */
  color?: MantineColor

  /** Styles resolver passed down from `RingProgress`. */
  getStyles: (selector: string, options?: any) => Record<string, any>
}

export interface RingProgressCurveProps
  extends Omit<BoxProps, keyof RingProgressCurveOwnProps>, RingProgressCurveOwnProps {}
