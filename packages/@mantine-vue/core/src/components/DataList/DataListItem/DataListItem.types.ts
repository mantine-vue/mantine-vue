import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type DataListItemStylesNames = 'item'

/** Props declared by `DataListItem` itself. See `DataListItemProps` for the full public type. */
export interface DataListItemOwnProps {
  /** Class names applied to DataList elements. */
  classNames?: StylesApiProps<DataListItemFactory>['classNames']

  /** Inline styles applied to DataList elements. */
  styles?: StylesApiProps<DataListItemProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface DataListItemProps
  extends Omit<BoxProps, keyof DataListItemOwnProps>, DataListItemOwnProps {}

export interface DataListItemSlots {
  /** Item content. */
  default?: () => VNodeChild
}

export type DataListItemFactory = Factory<{
  props: DataListItemProps
  ref: HTMLDivElement
  slots: DataListItemSlots
  element: 'div'
  stylesNames: DataListItemStylesNames
}>
