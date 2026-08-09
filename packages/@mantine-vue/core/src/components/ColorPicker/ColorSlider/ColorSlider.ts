import ColorSliderComponent from './ColorSlider.vue'
import classes from '../ColorPicker.module.css'

/** Generic track-and-thumb slider that `HueSlider` and `AlphaSlider` build on. */
export const ColorSlider = Object.assign(ColorSliderComponent, { classes })

export type {
  ColorSliderBaseProps,
  ColorSliderOwnProps,
  ColorSliderProps,
  ColorSliderStylesNames,
} from './ColorSlider.types'
