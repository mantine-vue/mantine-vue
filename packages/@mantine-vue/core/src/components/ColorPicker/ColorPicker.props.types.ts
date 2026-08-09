import type { BoxMod, BoxProps, MantineSize, StylesApiProps } from '../../core'
import type { ColorFormat } from './ColorPicker.types'

export type ColorPickerStylesNames =
  | 'wrapper'
  | 'preview'
  | 'body'
  | 'sliders'
  | 'slider'
  | 'sliderOverlay'
  | 'thumb'
  | 'saturation'
  | 'saturationOverlay'
  | 'swatches'
  | 'swatch'

export type ColorPickerCssVariables = {
  wrapper:
    | '--cp-preview-size'
    | '--cp-width'
    | '--cp-body-spacing'
    | '--cp-swatch-size'
    | '--cp-thumb-size'
    | '--cp-saturation-height'
}

/** Props declared by `ColorPicker` itself. See `ColorPickerProps` for the full public type. */
export interface ColorPickerOwnProps extends StylesApiProps<ColorPickerProps> {
  /** Selected colour, bound with `v-model`. */
  modelValue?: string

  /** Uncontrolled initial colour. */
  defaultValue?: string

  /**
   * Format the colour is reported in.
   *
   * @default 'hex'
   */
  format?: ColorFormat

  /**
   * If set, the saturation area and the sliders are rendered.
   *
   * @default true
   */
  withPicker?: boolean

  /** Predefined colours rendered as swatches below the picker. */
  swatches?: string[]

  /**
   * Number of swatches per row.
   *
   * @default 7
   */
  swatchesPerRow?: number

  /**
   * Controls the size of the picker.
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {})

  /**
   * If set, the picker fills the width of its container.
   *
   * @default false
   */
  fullWidth?: boolean

  /**
   * If set, the saturation area and the sliders can be focused and adjusted with the
   * arrow keys.
   *
   * @default true
   */
  focusable?: boolean

  /** `aria-label` of the saturation area. */
  saturationLabel?: string

  /** `aria-label` of the hue slider. */
  hueLabel?: string

  /** `aria-label` of the alpha slider. */
  alphaLabel?: string

  /** `name` of the hidden input that carries the colour in an uncontrolled form. */
  name?: string

  /** Props passed down to the hidden input. */
  hiddenInputProps?: Record<string, any>

  /**
   * Static selector used as the base of the generated class names.
   *
   * @default 'ColorPicker'
   */
  __staticSelector?: string

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface ColorPickerProps
  extends Omit<BoxProps, keyof ColorPickerOwnProps>, ColorPickerOwnProps {}
