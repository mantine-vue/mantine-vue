import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type DataListItemValueStylesNames = 'itemValue'

/** Props declared by `DataListItemValue` itself. See `DataListItemValueProps` for the full public type. */
export interface DataListItemValueOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to DataList elements. */
  classNames?: StylesApiProps<DataListItemValueFactory>['classNames']

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

export type DataListItemValueFactory = Factory<{
  props: Omit<DataListItemValueProps, 'rootRef'>
  ref: HTMLElement
  slots: DataListItemValueSlots
  element: 'dd'
  stylesNames: DataListItemValueStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
