import type { VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { BoxProps, MantineRadius, StylesApiProps, PolymorphicFactory } from '../../core'

/** Props declared by `ColorSwatch` itself. See `ColorSwatchProps` for the full public type. */
export interface ColorSwatchOwnProps extends StylesApiProps<ColorSwatchProps> {
  /** Receives the root DOM node. The factory narrows this to the element the selected root renders. */
  rootRef?: VueRefTarget<Element>

  /** Valid CSS color to display */
  color: string

  /**
   * Swatch `width` and `height`, any valid CSS value, numbers are converted to rem.
   *
   * @default 28
   */
  size?: string | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem.
   *
   * @default 1000
   */
  radius?: MantineRadius

  /**
   * If set, the swatch has inner `box-shadow`
   *
   * @default true
   */
  withShadow?: boolean
}

export interface ColorSwatchProps
  extends Omit<BoxProps, keyof ColorSwatchOwnProps>, ColorSwatchOwnProps {}

export interface ColorSwatchSlots {
  /** Content displayed over the color swatch. */
  default?: () => VNodeChild
}

export type ColorSwatchStylesNames =
  | 'root'
  | 'alphaOverlay'
  | 'shadowOverlay'
  | 'colorOverlay'
  | 'childrenOverlay'

export type ColorSwatchCssVariables = {
  root: '--cs-radius' | '--cs-size'
}

/** Public contract of `ColorSwatch`. `component` and `rootRef` come from the factory. */
export type ColorSwatchFactory = PolymorphicFactory<{
  props: Omit<ColorSwatchProps, 'component' | 'rootRef'>
  slots: ColorSwatchSlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  defaultComponent: 'div'
  defaultRef: HTMLDivElement
  stylesNames: ColorSwatchStylesNames
  vars: ColorSwatchCssVariables
}>
