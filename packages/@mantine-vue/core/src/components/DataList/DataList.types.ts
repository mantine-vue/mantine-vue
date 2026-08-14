import type { DataListItemValue } from './DataListItemValue/DataListItemValue'
import type { DataListItemLabel } from './DataListItemLabel/DataListItemLabel'
import type { DataListItem } from './DataListItem/DataListItem'
import type { VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
  Factory,
} from '../../core'

export type DataListStylesNames = 'root' | 'item' | 'itemLabel' | 'itemValue'

export type DataListCssVariables = {
  root: '--data-list-fz' | '--data-list-lh' | '--data-list-gap' | '--data-list-label-width'
}

export interface DataListSlots {
  /** `DataList.Item` children. */
  default?: () => VNodeChild
}

/** Props declared by `DataList` itself. See `DataListProps` for the full public type. */
export interface DataListOwnProps extends StylesApiProps<DataListFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Controls the `font-size` and `line-height` of the list. */
  size?: MantineSize | (string & {})

  /** Key of `theme.spacing` or any valid CSS value for the gap between items. */
  gap?: MantineSpacing

  /**
   * Whether each item's label sits beside its value or above it.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /** If set, a divider is rendered between the items. */
  withDivider?: boolean

  /** Width of the label column; numbers are treated as px. */
  labelWidth?: string | number

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface DataListProps extends Omit<BoxProps, keyof DataListOwnProps>, DataListOwnProps {}

export type DataListFactory = Factory<{
  props: Omit<DataListProps, 'rootRef'>
  ref: HTMLElement
  slots: DataListSlots
  element: 'dl'
  stylesNames: DataListStylesNames
  vars: DataListCssVariables
  staticComponents: {
    Item: typeof DataListItem
    ItemLabel: typeof DataListItemLabel
    ItemValue: typeof DataListItemValue
  }
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
