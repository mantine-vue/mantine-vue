import type { BoxProps } from '../../../core'
import type { ColorSliderBaseProps } from '../ColorSlider/ColorSlider'

/**
 * Props declared by `HueSlider` itself. Identical to the shared slider props: the hue
 * range and gradient are fixed by the component.
 */
export type HueSliderOwnProps = ColorSliderBaseProps

export interface HueSliderProps
  extends Omit<BoxProps, keyof HueSliderOwnProps>, HueSliderOwnProps {}
