import { factory } from '../../../core'
import DataListItemLabelComponent from './DataListItemLabel.vue'
import type { DataListItemLabelFactory } from './DataListItemLabel.types'
import classes from '../DataList.module.css'

export const DataListItemLabel = factory<DataListItemLabelFactory>(DataListItemLabelComponent, {
  classes,
})

export type {
  DataListItemLabelOwnProps,
  DataListItemLabelProps,
  DataListItemLabelSlots,
  DataListItemLabelStylesNames,
  DataListItemLabelFactory,
} from './DataListItemLabel.types'
