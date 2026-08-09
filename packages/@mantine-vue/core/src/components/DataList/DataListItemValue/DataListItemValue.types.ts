import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps } from '../../../core'

export type DataListItemValueStylesNames = 'itemValue'

/** Props declared by `DataListItemValue` itself. See `DataListItemValueProps` for the full public type. */
export interface DataListItemValueOwnProps {
  /** Class names applied to DataList elements. */
  classNames?: StylesApiProps<DataListItemValueProps>['classNames']

  /** Inline styles applied to DataList elements. */
  styles?: StylesApiProps<DataListItemValueProps>['styles']

  /** Element modifiers transformed into `data-` attributes. */
  mod?: BoxProps['mod']
}

export interface DataListItemValueProps
  extends Omit<BoxProps, keyof DataListItemValueOwnProps>, DataListItemValueOwnProps {}

export interface DataListItemValueSlots {
  /** Value content. */
  default?: () => VNodeChild
}
