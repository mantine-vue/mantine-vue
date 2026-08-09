import { withBoxProps } from '../../core'
import AngleSliderComponent, { varsResolver } from './AngleSlider.vue'
import classes from './AngleSlider.module.css'

export const AngleSlider = withBoxProps(
  Object.assign(AngleSliderComponent, { classes, varsResolver }),
)

export type {
  AngleSliderCssVariables,
  AngleSliderMark,
  AngleSliderOwnProps,
  AngleSliderProps,
  AngleSliderStylesNames,
} from './AngleSlider.types'
