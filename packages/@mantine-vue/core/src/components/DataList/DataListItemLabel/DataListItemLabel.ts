import { withBoxProps } from '../../../core'
import DataListItemLabelComponent from './DataListItemLabel.vue'
import classes from '../DataList.module.css'

export const DataListItemLabel = withBoxProps(DataListItemLabelComponent)
Object.assign(DataListItemLabel, { classes })

export type {
  DataListItemLabelOwnProps,
  DataListItemLabelProps,
  DataListItemLabelSlots,
  DataListItemLabelStylesNames,
} from './DataListItemLabel.types'
