import type { VNodeChild } from 'vue'
import type { BoxProps, StyleProp, StylesApiProps } from '../../core'

export type SimpleGridStylesNames = 'root' | 'container'

/** Props declared by `SimpleGrid` itself. See `SimpleGridProps` for the full public type. */
export interface SimpleGridOwnProps extends StylesApiProps<SimpleGridProps> {
  /**
   * Number of columns
   *
   * @default 1
   */
  cols?: StyleProp<number>

  /**
   * Spacing between columns
   *
   * @default 'md'
   */
  spacing?: StyleProp<string | number>

  /**
   * Spacing between rows. When not set, falls back to spacing value
   *
   * @default undefined
   */
  verticalSpacing?: StyleProp<string | number>

  /**
   * Determines type of queries that are used for responsive styles
   *
   * @default 'media'
   */
  type?: 'media' | 'container'

  /** Minimum column width when using auto-fit/auto-fill. When set, cols prop is ignored */
  minColWidth?: string | number

  /**
   * Grid repeat type when minColWidth is set
   *
   * @default 'auto-fill'
   */
  autoFlow?: 'auto-fit' | 'auto-fill'

  /** Sets the size of implicitly created grid rows */
  autoRows?: string
}

export interface SimpleGridProps
  extends Omit<BoxProps, keyof SimpleGridOwnProps>, SimpleGridOwnProps {}

export interface SimpleGridSlots {
  /** Grid content. */
  default?: () => VNodeChild
}
