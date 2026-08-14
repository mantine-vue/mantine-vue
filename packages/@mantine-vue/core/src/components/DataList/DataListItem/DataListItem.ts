import { factory } from '../../../core'
import DataListItemComponent from './DataListItem.vue'
import type { DataListItemFactory } from './DataListItem.types'
import classes from '../DataList.module.css'

export const DataListItem = factory<DataListItemFactory>(DataListItemComponent, { classes })

export type {
  DataListItemOwnProps,
  DataListItemProps,
  DataListItemSlots,
  DataListItemStylesNames,
  DataListItemFactory,
} from './DataListItem.types'
