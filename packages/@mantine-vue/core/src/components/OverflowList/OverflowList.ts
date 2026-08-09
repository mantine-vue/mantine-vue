import { withBoxProps } from '../../core'
import OverflowListComponent, { varsResolver } from './OverflowList.vue'
import classes from './OverflowList.module.css'

export const OverflowList = withBoxProps(
  Object.assign(OverflowListComponent, { classes, varsResolver }),
)

export type {
  OverflowListCssVariables,
  OverflowListOwnProps,
  OverflowListProps,
  OverflowListStylesNames,
} from './OverflowList.types'
