import { withBoxProps } from '../../../core'
import SliderRootComponent from './SliderRoot.vue'

/** Root element of `Slider` and `RangeSlider`, styled through the Slider context. */
export const SliderRoot = withBoxProps(SliderRootComponent)

export type { SliderRootOwnProps, SliderRootProps, SliderRootSlots } from './SliderRoot.types'
