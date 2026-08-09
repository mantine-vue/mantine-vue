import { withBoxProps } from '../../../core'
import RangeSliderComponent, { varsResolver } from './RangeSlider.vue'
import classes from '../Slider.module.css'

export const RangeSlider = withBoxProps(
  Object.assign(RangeSliderComponent, { classes, varsResolver }),
)

export type {
  RangeSliderEmits,
  RangeSliderOwnProps,
  RangeSliderProps,
  RangeSliderSlots,
  RangeSliderStylesNames,
  RangeSliderValue,
} from './RangeSlider.types'
