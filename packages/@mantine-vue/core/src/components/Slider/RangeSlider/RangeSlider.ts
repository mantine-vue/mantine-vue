import { factory } from '../../../core'
import RangeSliderComponent, { varsResolver } from './RangeSlider.vue'
import type { RangeSliderFactory } from './RangeSlider.types'
import classes from '../Slider.module.css'

export const RangeSlider = factory<RangeSliderFactory>(RangeSliderComponent, {
  classes,
  varsResolver,
})

export type {
  RangeSliderEmits,
  RangeSliderFactory,
  RangeSliderOwnProps,
  RangeSliderProps,
  RangeSliderSlots,
  RangeSliderStylesNames,
  RangeSliderValue,
} from './RangeSlider.types'
