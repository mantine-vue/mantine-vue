import type { BoxProps, StylesApiProps, Factory } from '../../core'

/** Props declared by `AspectRatio` itself. See `AspectRatioProps` for the full public type. */
export interface AspectRatioOwnProps extends StylesApiProps<AspectRatioFactory> {
  /**
   * Aspect ratio, for example, `16 / 9`, `4 / 3`, `1920 / 1080`
   *
   * @default 1
   */
  ratio?: number
}

export interface AspectRatioProps
  extends Omit<BoxProps, keyof AspectRatioOwnProps>, AspectRatioOwnProps {}

export type AspectRatioStylesNames = 'root'

export type AspectRatioCssVariables = {
  root: '--ar-ratio'
}

export type AspectRatioFactory = Factory<{
  props: AspectRatioProps
  ref: HTMLDivElement
  element: 'div'
  stylesNames: AspectRatioStylesNames
  vars: AspectRatioCssVariables
}>
