import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../core'

/** Props declared by `Collapse` itself. See `CollapseProps` for the full public type. */
export interface CollapseOwnProps {
  /**
   * Collapse orientation
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'

  /** Expanded state */
  expanded: boolean

  /**
   * Transition duration in ms
   *
   * @default 200
   */
  transitionDuration?: number

  /**
   * Transition timing function
   *
   * @default ease
   */
  transitionTimingFunction?: string

  /**
   * Determines whether the opacity is animated
   *
   * @default true
   */
  animateOpacity?: boolean

  /**
   * If set, the element is kept in the DOM when collapsed. When `true`, React 19 `Activity` is used to preserve state while collapsed. When `false`, the element is unmounted after the exit animation.
   *
   * @default true
   */
  keepMounted?: boolean
}

export interface CollapseProps extends Omit<BoxProps, keyof CollapseOwnProps>, CollapseOwnProps {}

export interface CollapseSlots {
  /** Content revealed when the collapse is expanded. */
  default?: () => VNodeChild
}
