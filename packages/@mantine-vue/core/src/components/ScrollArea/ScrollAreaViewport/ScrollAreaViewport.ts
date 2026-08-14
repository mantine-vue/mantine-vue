import { factory } from '../../../core'
import ScrollAreaViewportComponent from './ScrollAreaViewport.vue'
import type { ScrollAreaViewportFactory } from './ScrollAreaViewport.types'

export const ScrollAreaViewport = factory<ScrollAreaViewportFactory>(ScrollAreaViewportComponent)

export type {
  ScrollAreaViewportFactory,
  ScrollAreaViewportOwnProps,
  ScrollAreaViewportProps,
  ScrollAreaViewportSlots,
  ScrollAreaViewportStylesNames,
} from './ScrollAreaViewport.types'
