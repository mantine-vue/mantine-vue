import type { VNodeChild } from 'vue'
import type { BoxProps, MantineSpacing, StylesApiProps } from '../../core'

export type OverflowListStylesNames = 'root'

export type OverflowListCssVariables = { root: '--ol-gap' }

export interface OverflowListItemSlotPayload {
  /** Item rendered in this position. */
  item: any

  /** Index of the item in `data`. */
  index: number
}

export interface OverflowListOverflowSlotPayload {
  /** Items that did not fit and are represented by the overflow indicator. */
  items: any[]
}

export interface OverflowListSlots {
  /** Renders a single item. Takes precedence over the `renderItem` prop. */
  item?: (payload: OverflowListItemSlotPayload) => VNodeChild

  /** Renders the indicator for the items that did not fit. Takes precedence over the `renderOverflow` prop. */
  overflow?: (payload: OverflowListOverflowSlotPayload) => VNodeChild
}

/** Props declared by `OverflowList` itself. See `OverflowListProps` for the full public type. */
export interface OverflowListOwnProps extends StylesApiProps<OverflowListProps> {
  /** Items rendered in the list. */
  data: any[]

  /**
   * Renders a single item. Called with the item and its index in `data`.
   * Can also be set with the scoped `item` slot – the slot takes precedence over the prop.
   */
  renderItem?: (item: any, index: number) => VNodeChild

  /**
   * Renders the indicator for the items that did not fit. Called with those items.
   * Can also be set with the scoped `overflow` slot – the slot takes precedence over the prop.
   */
  renderOverflow?: (items: any[]) => VNodeChild

  /**
   * Maximum number of rows the items may occupy before they start collapsing.
   *
   * @default 1
   */
  maxRows?: number

  /**
   * Maximum number of items rendered, regardless of the available space.
   *
   * @default Infinity
   */
  maxVisibleItems?: number

  /** Key of `theme.spacing` or any valid CSS value to set the gap between the items. */
  gap?: MantineSpacing

  /**
   * End of the list the items collapse from. `start` also moves the overflow indicator
   * to the front.
   *
   * @default 'end'
   */
  collapseFrom?: 'start' | 'end'

  /**
   * Returns a stable key for an item. Used to decide when the data has really changed
   * and a re-measure is needed.
   */
  getItemKey?: (item: any, index: number) => PropertyKey
}

export interface OverflowListProps
  extends Omit<BoxProps, keyof OverflowListOwnProps>, OverflowListOwnProps {}
