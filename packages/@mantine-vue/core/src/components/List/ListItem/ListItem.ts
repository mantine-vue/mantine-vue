import { withBoxProps } from '../../../core'
import ListItemComponent from './ListItem.vue'
import classes from '../List.module.css'
export const ListItem = withBoxProps(Object.assign(ListItemComponent, { classes }))
export type {
  ListItemOwnProps,
  ListItemProps,
  ListItemSlots,
  ListItemStylesNames,
} from './ListItem.types'
