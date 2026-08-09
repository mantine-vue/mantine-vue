import type { VNodeChild } from 'vue'
import type { ColorFormat } from '../ColorPicker'
import type { InputBaseSlots } from '../InputBase'

export type ColorInputStylesNames = string

export interface ColorInputSlots extends InputBaseSlots {
  /** Icon of the eye dropper button. Alternative to the `eyeDropperIcon` prop. */
  eyeDropperIcon?: () => VNodeChild
}

/**
 * Props declared by `ColorInput` itself.
 *
 * Every prop of `InputBase` is also accepted and forwarded to the underlying input.
 */
export interface ColorInputProps {
  /** Color value, bound with `v-model`. */
  modelValue?: string

  /**
   * Uncontrolled initial value.
   *
   * @default ''
   */
  defaultValue?: string

  /**
   * Format the value is stored in.
   *
   * @default 'hex'
   */
  format?: ColorFormat

  /**
   * If set, the value cannot be typed and only the picker can change it.
   *
   * @default false
   */
  disallowInput?: boolean

  /**
   * If set, an invalid value is reverted to the last valid one when the input loses focus.
   *
   * @default true
   */
  fixOnBlur?: boolean

  /**
   * If set, a swatch of the current color is rendered in the left section.
   *
   * @default true
   */
  withPreview?: boolean

  /**
   * If set, an eye dropper button is rendered in the right section. Only shown in
   * browsers that support the EyeDropper API.
   *
   * @default true
   */
  withEyeDropper?: boolean

  /** Props passed down to the `Popover` that holds the picker. */
  popoverProps?: Record<string, any>

  /**
   * If set, the dropdown closes when a swatch is clicked.
   *
   * @default false
   */
  closeOnColorSwatchClick?: boolean

  /** Props passed down to the eye dropper `ActionIcon`. */
  eyeDropperButtonProps?: Record<string, any>

  /**
   * Icon of the eye dropper button.
   * Can also be set with the `eyeDropperIcon` slot – the slot takes precedence over the prop.
   */
  eyeDropperIcon?: any

  /**
   * If set, the saturation and hue picker is rendered in the dropdown.
   *
   * @default true
   */
  withPicker?: boolean

  /** Predefined colors rendered as swatches in the dropdown. */
  swatches?: string[]

  /**
   * Number of swatches per row.
   *
   * @default 7
   */
  swatchesPerRow?: number

  /** Any other prop is forwarded to the underlying `InputBase`. */
  [key: string]: any
}
