import type { BoxProps } from '../../../core'
import type { ColorSliderBaseProps } from '../ColorSlider/ColorSlider'

/** Props declared by `AlphaSlider` itself. See `AlphaSliderProps` for the full public type. */
export interface AlphaSliderOwnProps extends ColorSliderBaseProps {
  /** Colour the alpha gradient fades into, in any valid CSS format. */
  color: string
}

export interface AlphaSliderProps
  extends Omit<BoxProps, keyof AlphaSliderOwnProps>, AlphaSliderOwnProps {}
