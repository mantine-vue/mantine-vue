import type { BoxProps, StylesApiProps, Factory } from '../../core'
import type { TitleOrder, TitleSize } from './get-title-size'

/** Props declared by `Title` itself. See `TitleProps` for the full public type. */
export interface TitleOwnProps extends StylesApiProps<TitleFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Heading order (1-6), controls `font-size` style if `size` prop is not set
   *
   * @default 1
   */
  order?: TitleOrder

  /** Changes title size, if not set, then size is controlled by `order` prop */
  size?: TitleSize

  /** Number of lines after which heading will be truncated */
  lineClamp?: number

  /**
   * Heading `text-wrap` CSS property
   *
   * @default 'wrap'
   */
  textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
}

export interface TitleProps extends Omit<BoxProps, keyof TitleOwnProps>, TitleOwnProps {}

export type TitleStylesNames = 'root'

export type TitleCssVariables = {
  root: '--title-fw' | '--title-lh' | '--title-fz' | '--title-line-clamp' | '--title-text-wrap'
}

export type TitleFactory = Factory<{
  props: Omit<TitleProps, 'rootRef'>
  ref: HTMLHeadingElement
  element: 'h1'
  stylesNames: TitleStylesNames
  vars: TitleCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
