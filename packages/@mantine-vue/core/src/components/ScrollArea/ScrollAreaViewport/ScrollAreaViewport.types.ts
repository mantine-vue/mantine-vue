import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'

export interface ScrollAreaViewportSlots {
  /** Scrollable content. */
  default?: () => VNodeChild
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrollAreaViewportOwnProps {}

export interface ScrollAreaViewportEmits {
  /** Emitted with the viewport element once it is mounted. */
  'viewport-mounted': [node: HTMLDivElement | null]

  /** Emitted with the content element once it is mounted. */
  'content-mounted': [node: HTMLDivElement | null]
}

export interface ScrollAreaViewportProps
  extends Omit<BoxProps, keyof ScrollAreaViewportOwnProps>, ScrollAreaViewportOwnProps {}
