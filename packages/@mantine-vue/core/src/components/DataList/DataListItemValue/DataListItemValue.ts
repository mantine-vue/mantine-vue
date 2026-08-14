import { factory } from '../../../core'
import DataListItemValueComponent from './DataListItemValue.vue'
import type { DataListItemValueFactory } from './DataListItemValue.types'
import classes from '../DataList.module.css'

export const DataListItemValue = factory<DataListItemValueFactory>(DataListItemValueComponent, {
  classes,
})

export type {
  DataListItemValueOwnProps,
  DataListItemValueProps,
  DataListItemValueSlots,
  DataListItemValueStylesNames,
  DataListItemValueFactory,
} from './DataListItemValue.types'
