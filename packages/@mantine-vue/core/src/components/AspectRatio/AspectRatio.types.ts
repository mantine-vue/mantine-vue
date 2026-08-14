import type { BoxProps, StylesApiProps, Factory } from '../../core'

/** Props declared by `AspectRatio` itself. See `AspectRatioProps` for the full public type. */
export interface AspectRatioOwnProps extends StylesApiProps<AspectRatioFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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
  props: Omit<AspectRatioProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
  stylesNames: AspectRatioStylesNames
  vars: AspectRatioCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
