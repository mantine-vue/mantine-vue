import { withBoxProps } from '../../../core'
import DataListItemValueComponent from './DataListItemValue.vue'
import classes from '../DataList.module.css'

export const DataListItemValue = withBoxProps(DataListItemValueComponent)
Object.assign(DataListItemValue, { classes })

export type {
  DataListItemValueOwnProps,
  DataListItemValueProps,
  DataListItemValueSlots,
  DataListItemValueStylesNames,
} from './DataListItemValue.types'
