import { withBoxProps } from '../../core'
import { ListItem } from './ListItem/ListItem'
import ListComponent, { varsResolver } from './List.vue'
import classes from './List.module.css'
export const List = withBoxProps(
  Object.assign(ListComponent, { classes, varsResolver, Item: ListItem }),
)
export type {
  ListCssVariables,
  ListOwnProps,
  ListProps,
  ListSlots,
  ListStylesNames,
} from './List.types'
