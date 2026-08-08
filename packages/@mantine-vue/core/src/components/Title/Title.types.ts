import type { BoxProps, StylesApiProps } from '../../core'
import type { TitleOrder, TitleSize } from './get-title-size'

/** Props declared by `Title` itself. See `TitleProps` for the full public type. */
export interface TitleOwnProps extends StylesApiProps<TitleProps> {
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
