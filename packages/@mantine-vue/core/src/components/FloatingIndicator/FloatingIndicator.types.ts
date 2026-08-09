import type { VNodeChild } from 'vue'
import type { BoxMod, BoxProps, StylesApiProps } from '../../core'

/** Props declared by `FloatingIndicator` itself. See `FloatingIndicatorProps` for the full public type. */
export interface FloatingIndicatorOwnProps extends StylesApiProps<FloatingIndicatorProps> {
  /**
   * Target element over which the indicator is displayed.
   * The indicator will be positioned to match the target's size and position.
   */
  target?: HTMLElement | null | undefined

  /**
   * Parent container element that must have `position: relative`.
   * The indicator's position is calculated relative to this element.
   */
  parent?: HTMLElement | null | undefined

  /**
   * Transition duration in ms
   *
   * @default 150
   */
  transitionDuration?: number | string

  /**
   * Controls whether the indicator should be hidden initially and displayed after the parent's transition ends.
   * Set to `true` when the parent container has CSS transitions (e.g., `transform: scale()`) to prevent
   * the indicator from appearing at the wrong position during the parent's animation.
   *
   * @default false
   */
  displayAfterTransitionEnd?: boolean

  /**
   * Root element or component rendered by `FloatingIndicator`.
   *
   * @default 'div'
   */
  component?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface FloatingIndicatorProps
  extends Omit<BoxProps, keyof FloatingIndicatorOwnProps>, FloatingIndicatorOwnProps {}

export interface FloatingIndicatorSlots {
  /** Optional indicator content. */
  default?: () => VNodeChild
}

export type FloatingIndicatorStylesNames = 'root'

export type FloatingIndicatorCssVariables = {
  root: '--transition-duration'
}
