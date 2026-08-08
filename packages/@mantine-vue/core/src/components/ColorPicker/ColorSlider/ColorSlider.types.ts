import type { BoxProps, StylesApiProps } from '../../../core'

export type ColorSliderStylesNames = 'slider' | 'sliderOverlay' | 'thumb'

/** Props shared by `HueSlider` and `AlphaSlider`, which both wrap `ColorSlider`. */
export interface ColorSliderBaseProps extends StylesApiProps {
  /** Current value, bound with `v-model`. */
  modelValue?: number

  /** Uncontrolled initial value. */
  defaultValue?: number

  /**
   * Controls the height of the slider.
   *
   * @default 'md'
   */
  size?: string

  /**
   * If set, the slider can be focused and adjusted with the arrow keys.
   *
   * @default true
   */
  focusable?: boolean
}

/** Props declared by `ColorSlider` itself. See `ColorSliderProps` for the full public type. */
export interface ColorSliderOwnProps extends ColorSliderBaseProps {
  /** Value that corresponds to the far right of the track. */
  maxValue: number

  /** Style objects layered over the track to draw the gradient. */
  overlays: Record<string, any>[]

  /** If set, the value is rounded to a whole number. */
  round: boolean

  /**
   * Background colour of the thumb.
   *
   * @default 'transparent'
   */
  thumbColor?: string

  /**
   * Static selector used as the base of the generated class names.
   *
   * @default 'ColorPicker'
   */
  __staticSelector?: string
}

export interface ColorSliderProps
  extends Omit<BoxProps, keyof ColorSliderOwnProps>, ColorSliderOwnProps {}
