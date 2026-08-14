import type { VueRefTarget } from '@mantine-vue/hooks'
import type { GridCol } from './GridCol/GridCol'
import type { VNodeChild } from 'vue'
import type {
  AlignItems,
  BoxProps,
  JustifyContent,
  MantineSpacing,
  Overflow,
  StyleProp,
  StylesApiProps,
  Factory,
} from '../../core'
import type { GridBreakpoints } from './Grid.context'

/** Props declared by `Grid` itself. See `GridProps` for the full public type. */
export interface GridOwnProps extends StylesApiProps<GridFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Gap between columns and rows, key of `theme.spacing` or any valid CSS value
   *
   * @default 'md'
   */
  gap?: StyleProp<MantineSpacing>

  /** Row gap, overrides `gap` for vertical spacing */
  rowGap?: StyleProp<MantineSpacing>

  /** Column gap, overrides `gap` for horizontal spacing */
  columnGap?: StyleProp<MantineSpacing>

  /**
   * If set, columns in the last row expand to fill all available space
   *
   * @default false
   */
  grow?: boolean

  /**
   * Sets `justify-content`
   *
   * @default flex-start
   */
  justify?: JustifyContent

  /**
   * Sets `align-items`
   *
   * @default stretch
   */
  align?: AlignItems

  /**
   * Number of columns in each row
   *
   * @default 12
   */
  columns?: number

  /**
   * Sets `overflow` CSS property on the root element
   *
   * @default 'visible'
   */
  overflow?: Overflow

  /**
   * Type of queries used for responsive styles
   *
   * @default 'media'
   */
  type?: 'media' | 'container'

  /** Breakpoints values, only used with `type="container"` */
  breakpoints?: GridBreakpoints
}

export interface GridProps extends Omit<BoxProps, keyof GridOwnProps>, GridOwnProps {}

export interface GridSlots {
  default?: () => VNodeChild
}
export type GridStylesNames = 'root' | 'col' | 'inner' | 'container'
export type GridCssVariables = { root: '--grid-justify' | '--grid-align' | '--grid-overflow' }

export type GridFactory = Factory<{
  props: Omit<GridProps, 'rootRef'>
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  slots: GridSlots
  element: 'div'
  stylesNames: GridStylesNames
  vars: GridCssVariables
  staticComponents: {
    Col: typeof GridCol
  }
}>
