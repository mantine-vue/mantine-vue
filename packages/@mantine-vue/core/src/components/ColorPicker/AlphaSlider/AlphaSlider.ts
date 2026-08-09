import { ColorSlider } from '../ColorSlider/ColorSlider'
import AlphaSliderComponent from './AlphaSlider.vue'

/** Horizontal slider that selects the alpha channel, `0` to `1`. */
export const AlphaSlider = Object.assign(AlphaSliderComponent, { classes: ColorSlider.classes })

export type { AlphaSliderOwnProps, AlphaSliderProps } from './AlphaSlider.types'
