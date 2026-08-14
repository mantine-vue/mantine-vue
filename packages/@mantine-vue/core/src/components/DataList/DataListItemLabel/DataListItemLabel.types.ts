import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

export type DataListItemLabelStylesNames = 'itemLabel'

/** Props declared by `DataListItemLabel` itself. See `DataListItemLabelProps` for the full public type. */
export interface DataListItemLabelOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Class names applied to DataList elements. */
  classNames?: StylesApiProps<DataListItemLabelFactory>['classNames']

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

export type DataListItemLabelFactory = Factory<{
  props: Omit<DataListItemLabelProps, 'rootRef'>
  ref: HTMLElement
  slots: DataListItemLabelSlots
  element: 'dt'
  stylesNames: DataListItemLabelStylesNames
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
