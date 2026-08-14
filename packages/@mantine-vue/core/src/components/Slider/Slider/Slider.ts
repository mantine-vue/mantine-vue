import { factory } from '../../../core'
import type { SliderFactory } from './Slider.types'
import SliderComponent, { varsResolver } from './Slider.vue'
import classes from '../Slider.module.css'

export const Slider = factory<SliderFactory>(SliderComponent, { classes, varsResolver })

export type {
  SliderCssVariables,
  SliderEmits,
  SliderFactory,
  SliderOwnProps,
  SliderProps,
  SliderSlots,
  SliderStylesNames,
} from './Slider.types'
