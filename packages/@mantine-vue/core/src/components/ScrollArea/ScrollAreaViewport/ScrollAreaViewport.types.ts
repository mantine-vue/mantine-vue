import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../../core'

export interface ScrollAreaViewportSlots {
  /** Scrollable content. */
  default?: () => VNodeChild
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScrollAreaViewportOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>
}

export interface ScrollAreaViewportEmits {
  /** Emitted with the viewport element once it is mounted. */
  'viewport-mounted': [node: HTMLDivElement | null]

  /** Emitted with the content element once it is mounted. */
  'content-mounted': [node: HTMLDivElement | null]
}

export interface ScrollAreaViewportProps
  extends Omit<BoxProps, keyof ScrollAreaViewportOwnProps>, ScrollAreaViewportOwnProps {}

export type ScrollAreaViewportStylesNames = 'content'

export type ScrollAreaViewportFactory = Factory<{
  props: Omit<ScrollAreaViewportProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ScrollAreaViewportSlots
  emits: ScrollAreaViewportEmits
  element: 'div'
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
