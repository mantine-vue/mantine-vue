import { withBoxProps } from '../../../core'
import ScrollAreaViewportComponent from './ScrollAreaViewport.vue'

/** Scrollable viewport of a `ScrollArea`, wrapping the content element. */
export const ScrollAreaViewport = withBoxProps(ScrollAreaViewportComponent)

export type {
  ScrollAreaViewportOwnProps,
  ScrollAreaViewportProps,
  ScrollAreaViewportSlots,
} from './ScrollAreaViewport.types'
