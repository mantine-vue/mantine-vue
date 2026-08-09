import type { VNodeChild } from 'vue'
import type { BoxProps, MantineNode, StylesApiProps } from '../../core'

export type ScrollerStylesNames = 'root' | 'container' | 'content' | 'control' | 'chevron'
export type ScrollerCssVariables = {
  root: '--scroller-control-size' | '--scroller-background-color'
}

/** Props declared by `Scroller` itself. See `ScrollerProps` for the full public type. */
export interface ScrollerOwnProps extends StylesApiProps<ScrollerProps> {
  /** Amount of pixels scrolled when a control is clicked. @default 200 */
  scrollAmount?: number

  /** Size of the control buttons. */
  controlSize?: string | number

  /** Background color used by the control edge gradient. */
  edgeGradientColor?: string

  /** Props passed to the start control button. */
  startControlProps?: Record<string, any>

  /** Props passed to the end control button. */
  endControlProps?: Record<string, any>

  /** Start control icon. Defaults to `AccordionChevron`. */
  startControlIcon?: MantineNode

  /** End control icon. Defaults to `AccordionChevron`. */
  endControlIcon?: MantineNode

  /** Keeps the start control visible regardless of scroll position. @default false */
  showStartControl?: boolean

  /** Keeps the end control visible regardless of scroll position. @default false */
  showEndControl?: boolean

  /** Determines whether content can be scrolled by dragging. @default true */
  draggable?: boolean
}

export interface ScrollerProps extends Omit<BoxProps, keyof ScrollerOwnProps>, ScrollerOwnProps {}

export interface ScrollerSlots {
  /** Scrollable content. */
  default?: () => VNodeChild

  /** Custom start control icon, alternative to `startControlIcon`. */
  startControlIcon?: () => VNodeChild

  /** Custom end control icon, alternative to `endControlIcon`. */
  endControlIcon?: () => VNodeChild
}
