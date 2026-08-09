import type { CSSProperties, VNodeChild } from 'vue'
import type { BoxMod, BoxProps, MantineColor, MantineSpacing, StylesApiProps } from '../../core'

export type TableVariant = 'default' | 'vertical'

export type TableStylesNames =
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tfoot'
  | 'tr'
  | 'th'
  | 'td'
  | 'caption'

export type TableCssVariables = {
  table:
    | '--table-layout'
    | '--table-caption-side'
    | '--table-horizontal-spacing'
    | '--table-vertical-spacing'
    | '--table-border-color'
    | '--table-striped-color'
    | '--table-highlight-on-hover-color'
    | '--table-sticky-header-offset'
}

/** Rows and cells used to render a table from data instead of markup. */
export interface TableData {
  head?: any[]
  body?: any[][]
  foot?: any[]
  caption?: string
}

export interface TableSlots {
  /** Table sections. Replaces the markup generated from `data`. */
  default?: () => VNodeChild
}

/** Props declared by `Table` itself. See `TableProps` for the full public type. */
export interface TableOwnProps extends StylesApiProps<TableProps> {
  /** Value of the `table-layout` CSS property. */
  layout?: CSSProperties['tableLayout']

  /**
   * Side the caption is rendered on.
   *
   * @default 'bottom'
   */
  captionSide?: 'top' | 'bottom'

  /** Key of `theme.colors` or any valid CSS color of the borders. */
  borderColor?: MantineColor

  /**
   * If set, the table has an outer border.
   *
   * @default false
   */
  withTableBorder?: boolean

  /**
   * If set, vertical borders are rendered between the columns.
   *
   * @default false
   */
  withColumnBorders?: boolean

  /**
   * If set, horizontal borders are rendered between the rows.
   *
   * @default true
   */
  withRowBorders?: boolean

  /** Key of `theme.spacing` or any valid CSS value for the horizontal cell padding. */
  horizontalSpacing?: MantineSpacing

  /**
   * Key of `theme.spacing` or any valid CSS value for the vertical cell padding.
   *
   * @default 7
   */
  verticalSpacing?: MantineSpacing

  /**
   * If set, every second row is shaded. `true` is the same as `'odd'`.
   *
   * @default false
   */
  striped?: boolean | 'odd' | 'even'

  /** Key of `theme.colors` or any valid CSS color of the striped rows. */
  stripedColor?: MantineColor

  /**
   * If set, rows are highlighted while hovered.
   *
   * @default false
   */
  highlightOnHover?: boolean

  /** Key of `theme.colors` or any valid CSS color of the hovered row. */
  highlightOnHoverColor?: MantineColor

  /**
   * Data the table is generated from.
   * Ignored when the default slot is used.
   */
  data?: TableData

  /**
   * If set, the header sticks to the top of the viewport while scrolling.
   *
   * @default false
   */
  stickyHeader?: boolean

  /** Offset the sticky header sticks at, for example below a fixed app header. */
  stickyHeaderOffset?: string | number

  /**
   * If set, digits use tabular figures so columns of numbers line up.
   *
   * @default false
   */
  tabularNums?: boolean

  /** Controls the visual representation of the table. */
  variant?: TableVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface TableProps extends Omit<BoxProps, keyof TableOwnProps>, TableOwnProps {}
