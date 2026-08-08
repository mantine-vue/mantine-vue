import { withBoxProps } from '../../../core'
import SliderComponent, { varsResolver } from './Slider.vue'
import classes from '../Slider.module.css'

export const Slider = withBoxProps(Object.assign(SliderComponent, { classes, varsResolver }))

export type {
  SliderCssVariables,
  SliderEmits,
  SliderOwnProps,
  SliderProps,
  SliderSlots,
  SliderStylesNames,
} from './Slider.types'
