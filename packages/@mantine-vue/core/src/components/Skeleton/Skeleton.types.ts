import type { BoxProps, StylesApiProps } from '../../core'

/** Props declared by `Skeleton` itself. See `SkeletonProps` for the full public type. */
export interface SkeletonOwnProps extends StylesApiProps<SkeletonProps> {
  /**
   * Determines whether Skeleton overlay should be displayed
   *
   * @default true
   */
  visible?: boolean

  /**
   * Skeleton `height`, numbers are converted to rem
   *
   * @default auto
   */
  height?: string | number

  /**
   * Skeleton `width`, numbers are converted to rem, ignored when `circle` prop is set.
   *
   * @default 100%
   */
  width?: string | number

  /**
   * If set, Skeleton `width` and `border-radius` are equal to its `height`
   *
   * @default false
   */
  circle?: boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem.
   *
   * @default theme.defaultRadius
   */
  radius?: string | number

  /**
   * Enables animation
   *
   * @default true
   */
  animate?: boolean
}

export interface SkeletonProps extends Omit<BoxProps, keyof SkeletonOwnProps>, SkeletonOwnProps {}
