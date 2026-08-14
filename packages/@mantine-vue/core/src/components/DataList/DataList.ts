import { factory } from '../../core'
import DataListComponent, { varsResolver } from './DataList.vue'
import type { DataListFactory } from './DataList.types'
import { DataListItem } from './DataListItem/DataListItem'
import { DataListItemLabel } from './DataListItemLabel/DataListItemLabel'
import { DataListItemValue } from './DataListItemValue/DataListItemValue'
import classes from './DataList.module.css'

export const DataList = factory<DataListFactory>(DataListComponent, {
  classes,
  varsResolver,
  Item: DataListItem,
  ItemLabel: DataListItemLabel,
  ItemValue: DataListItemValue,
})

export type {
  DataListCssVariables,
  DataListOwnProps,
  DataListProps,
  DataListSlots,
  DataListStylesNames,
  DataListFactory,
} from './DataList.types'
