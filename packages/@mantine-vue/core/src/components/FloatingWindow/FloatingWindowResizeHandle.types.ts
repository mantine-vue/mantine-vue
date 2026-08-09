import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../core'

export interface FloatingWindowResizeHandleSlots {
  /** Content of the handle, usually a grip icon. */
  default?: () => VNodeChild
}

/**
 * Props declared by `FloatingWindow.ResizeHandle` itself. See
 * `FloatingWindowResizeHandleProps` for the full public type.
 */
export interface FloatingWindowResizeHandleOwnProps {
  /**
   * `aria-label` of the handle. A consumer `aria-label` attribute takes precedence.
   *
   * @default 'Resize window'
   */
  ariaLabel?: string

  /**
   * `tabindex` of the handle. The handle is focusable so the window can be resized with
   * the arrow keys.
   *
   * @default 0
   */
  tabindex?: number
}

export interface FloatingWindowResizeHandleProps
  extends
    Omit<BoxProps, keyof FloatingWindowResizeHandleOwnProps>,
    FloatingWindowResizeHandleOwnProps {}
