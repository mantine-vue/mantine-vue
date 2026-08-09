import { withBoxProps } from '../../../core'
import DataListItemComponent from './DataListItem.vue'
import classes from '../DataList.module.css'

export const DataListItem = withBoxProps(DataListItemComponent)
Object.assign(DataListItem, { classes })

export type {
  DataListItemOwnProps,
  DataListItemProps,
  DataListItemSlots,
  DataListItemStylesNames,
} from './DataListItem.types'
