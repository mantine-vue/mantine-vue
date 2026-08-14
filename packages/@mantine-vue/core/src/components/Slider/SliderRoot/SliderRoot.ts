import { factory } from '../../../core'
import SliderRootComponent from './SliderRoot.vue'
import type { SliderRootFactory } from './SliderRoot.types'

export const SliderRoot = factory<SliderRootFactory>(SliderRootComponent)

export type {
  SliderRootFactory,
  SliderRootOwnProps,
  SliderRootProps,
  SliderRootSlots,
  SliderRootStylesNames,
} from './SliderRoot.types'
