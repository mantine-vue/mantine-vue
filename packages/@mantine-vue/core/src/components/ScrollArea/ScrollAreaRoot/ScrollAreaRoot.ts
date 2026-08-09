import { withBoxProps } from '../../../core'
import ScrollAreaRootComponent from './ScrollAreaRoot.vue'

/** Owns the scroll area context that every other part of the component reads. */
export const ScrollAreaRoot = withBoxProps(ScrollAreaRootComponent)

export type {
  ScrollAreaRootOwnProps,
  ScrollAreaRootProps,
  ScrollAreaRootSlots,
} from './ScrollAreaRoot.types'
