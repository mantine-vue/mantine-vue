import type { VNodeChild } from 'vue'

export interface ScrollAreaScrollbarSlots {
  /** The scrollbar thumb. */
  default?: () => VNodeChild
}

/** Props declared by `ScrollAreaScrollbar` itself. */
export interface ScrollAreaScrollbarProps {
  /** Axis the scrollbar controls. */
  orientation: 'horizontal' | 'vertical'

  /**
   * If set, the scrollbar is rendered even when the content does not overflow.
   *
   * @default false
   */
  forceMount?: boolean
}

/** Props declared by `ScrollAreaScrollbarVisible` itself. */
export interface ScrollAreaScrollbarVisibleProps {
  /**
   * Axis the scrollbar controls.
   *
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}
