import type { VNodeChild } from 'vue'
import type { Sizes } from '../ScrollArea.types'

export interface ScrollbarSlots {
  /** The scrollbar thumb. */
  default?: () => VNodeChild
}

/**
 * Internal contract between `ScrollAreaScrollbarVisible` and the axis scrollbars.
 * Not part of the public API.
 */
export interface ScrollbarPrivateProps {
  /** Measured content, viewport and scrollbar sizes. */
  sizes: Sizes

  /** Whether a draggable thumb should be rendered. */
  hasThumb: boolean

  /** Called with the thumb element once it is mounted. */
  onThumbChange: (thumb: HTMLDivElement | null) => void

  /** Called when the pointer is released after dragging the thumb. */
  onThumbPointerUp: () => void

  /** Called with the pointer position where the thumb drag started. */
  onThumbPointerDown: (pointerPos: { x: number; y: number }) => void

  /** Called when the thumb has to be repositioned from the scroll offset. */
  onThumbPositionChange: () => void

  /** Called on wheel events over the scrollbar, with the maximum scroll offset. */
  onWheelScroll: (event: WheelEvent, maxScrollPos: number) => void

  /** Called with the pointer position while the track is dragged. */
  onDragScroll: (pointerPos: { x: number; y: number }) => void

  /** Called when the scrollbar or the content is resized. */
  onResize: () => void
}

export interface ScrollbarEmits {
  /** Emitted with the scrollbar element once it is mounted. */
  'scrollbar-mounted': [node: HTMLDivElement | null]
}
