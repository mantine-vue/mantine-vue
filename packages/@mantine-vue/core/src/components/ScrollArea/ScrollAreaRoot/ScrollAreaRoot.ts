import { factory } from '../../../core'
import ScrollAreaRootComponent from './ScrollAreaRoot.vue'
import type { ScrollAreaRootFactory } from './ScrollAreaRoot.types'

export const ScrollAreaRoot = factory<ScrollAreaRootFactory>(ScrollAreaRootComponent)

export type {
  ScrollAreaRootFactory,
  ScrollAreaRootOwnProps,
  ScrollAreaRootProps,
  ScrollAreaRootSlots,
} from './ScrollAreaRoot.types'
