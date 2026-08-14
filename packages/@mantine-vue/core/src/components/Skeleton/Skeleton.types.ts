import type { BoxProps, StylesApiProps, Factory } from '../../core'

/** Props declared by `Skeleton` itself. See `SkeletonProps` for the full public type. */
export interface SkeletonOwnProps extends StylesApiProps<SkeletonFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type SkeletonStylesNames = 'root'

export type SkeletonCssVariables = {
  root: '--skeleton-height' | '--skeleton-width' | '--skeleton-radius'
}

export type SkeletonFactory = Factory<{
  props: Omit<SkeletonProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
  stylesNames: SkeletonStylesNames
  vars: SkeletonCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
