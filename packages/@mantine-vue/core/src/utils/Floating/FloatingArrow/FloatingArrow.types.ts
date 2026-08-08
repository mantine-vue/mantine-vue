import type { ArrowPosition, FloatingPosition } from '../types'

/** Props declared by `FloatingArrow` itself. */
export interface FloatingArrowProps {
  /** Position of the floating element the arrow points away from. */
  position: FloatingPosition

  /** Width and height of the arrow in px. */
  arrowSize: number

  /** Distance between the arrow and the edge of the floating element in px. */
  arrowOffset: number

  /** Border radius of the arrow in px. */
  arrowRadius: number

  /** Alignment of the arrow along the floating element's edge. */
  arrowPosition: ArrowPosition

  /** Horizontal offset reported by the floating middleware. */
  arrowX?: number

  /** Vertical offset reported by the floating middleware. */
  arrowY?: number

  /**
   * If set, the arrow is rendered. Nothing is rendered otherwise.
   *
   * @default false
   */
  visible?: boolean
}
