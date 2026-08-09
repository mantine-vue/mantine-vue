import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type DataListItemLabelStylesNames = 'itemLabel'

/** Props declared by `DataListItemLabel` itself. See `DataListItemLabelProps` for the full public type. */
export interface DataListItemLabelOwnProps {
  /** Class names applied to DataList elements. */
  classNames?: StylesApiProps<DataListItemLabelProps>['classNames']

  /** Inline styles applied to DataList elements. */
  styles?: StylesApiProps<DataListItemLabelProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface DataListItemLabelProps
  extends Omit<BoxProps, keyof DataListItemLabelOwnProps>, DataListItemLabelOwnProps {}

export interface DataListItemLabelSlots {
  /** Label content. */
  default?: () => VNodeChild
}
