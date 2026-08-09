import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../core'

export type AngleSliderStylesNames = 'root' | 'thumb' | 'label' | 'marks' | 'mark'

export type AngleSliderCssVariables = {
  root: '--slider-size' | '--thumb-size'
}

export interface AngleSliderMark {
  /** Angle in degrees the mark is rendered at. */
  value: number

  /** Label rendered next to the mark. */
  label?: string
}

/** Props declared by `AngleSlider` itself. See `AngleSliderProps` for the full public type. */
export interface AngleSliderOwnProps extends StylesApiProps<AngleSliderProps> {
  /**
   * Number of degrees the value changes by with each arrow key press.
   *
   * @default 1
   */
  step?: number

  /** Angle in degrees, bound with `v-model`. */
  modelValue?: number

  /** Uncontrolled initial angle in degrees. */
  defaultValue?: number

  /**
   * If set, the current angle is rendered in the center.
   *
   * @default true
   */
  withLabel?: boolean

  /** Marks rendered around the slider. */
  marks?: AngleSliderMark[]

  /** Diameter of the slider in px. */
  size?: number

  /** Size of the thumb in px. */
  thumbSize?: number

  /** Formats the value rendered in the center. */
  formatLabel?: (value: number) => VNodeChild

  /**
   * Sets the disabled state, in which the value cannot be changed.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * If set, the value can only be one of the `marks` values.
   *
   * @default false
   */
  restrictToMarks?: boolean

  /** Props passed down to the hidden input. */
  hiddenInputProps?: Record<string, any>

  /** `name` of the hidden input, used when the slider is part of a form. */
  name?: string
}

export interface AngleSliderProps
  extends Omit<BoxProps, keyof AngleSliderOwnProps>, AngleSliderOwnProps {}
