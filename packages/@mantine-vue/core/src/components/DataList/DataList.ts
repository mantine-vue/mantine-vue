import { withBoxProps } from '../../core'
import DataListComponent, { varsResolver } from './DataList.vue'
import { DataListItem } from './DataListItem/DataListItem'
import { DataListItemLabel } from './DataListItemLabel/DataListItemLabel'
import { DataListItemValue } from './DataListItemValue/DataListItemValue'
import classes from './DataList.module.css'

export const DataList = withBoxProps(
  Object.assign(DataListComponent, {
    classes,
    varsResolver,
    Item: DataListItem,
    ItemLabel: DataListItemLabel,
    ItemValue: DataListItemValue,
  }),
)

export type {
  DataListCssVariables,
  DataListOwnProps,
  DataListProps,
  DataListSlots,
  DataListStylesNames,
} from './DataList.types'
