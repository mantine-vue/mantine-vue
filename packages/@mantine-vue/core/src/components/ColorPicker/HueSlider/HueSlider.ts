import { ColorSlider } from '../ColorSlider/ColorSlider'
import HueSliderComponent from './HueSlider.vue'

/** Horizontal slider that selects the hue channel, `0` to `360`. */
export const HueSlider = Object.assign(HueSliderComponent, { classes: ColorSlider.classes })

export type { HueSliderOwnProps, HueSliderProps } from './HueSlider.types'
