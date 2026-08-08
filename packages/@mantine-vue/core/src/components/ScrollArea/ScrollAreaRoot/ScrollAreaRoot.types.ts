import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'
import type { ScrollAreaContextValue } from '../ScrollArea.context'

export interface ScrollAreaRootSlots {
  /** Viewport, scrollbars and corner. */
  default?: () => VNodeChild
}

/**
 * Props declared by `ScrollAreaRoot` itself.
 * See `ScrollAreaRootProps` for the full public type.
 */
export interface ScrollAreaRootOwnProps {
  /** Styles resolver shared with every part of the scroll area through context. */
  getStyles: ScrollAreaContextValue['getStyles']

  /**
   * Controls when the scrollbars are visible.
   *
   * @default 'hover'
   */
  type?: ScrollAreaContextValue['type']

  /** Axes that get a scrollbar. */
  scrollbars?: ScrollAreaContextValue['scrollbars']

  /**
   * Delay in ms before the scrollbars are hidden again.
   *
   * @default 1000
   */
  scrollHideDelay?: number
}

export interface ScrollAreaRootProps
  extends Omit<BoxProps, keyof ScrollAreaRootOwnProps>, ScrollAreaRootOwnProps {}
