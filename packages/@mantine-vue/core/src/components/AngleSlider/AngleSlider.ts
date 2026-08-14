import { factory } from '../../core'
import AngleSliderComponent, { varsResolver } from './AngleSlider.vue'
import type { AngleSliderFactory } from './AngleSlider.types'
import classes from './AngleSlider.module.css'

export const AngleSlider = factory<AngleSliderFactory>(AngleSliderComponent, {
  classes,
  varsResolver,
})

export type {
  AngleSliderCssVariables,
  AngleSliderMark,
  AngleSliderOwnProps,
  AngleSliderProps,
  AngleSliderStylesNames,
  AngleSliderFactory,
} from './AngleSlider.types'
