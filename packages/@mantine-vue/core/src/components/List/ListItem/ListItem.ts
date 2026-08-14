import { factory } from '../../../core'
import ListItemComponent from './ListItem.vue'
import type { ListItemFactory } from './ListItem.types'
import classes from '../List.module.css'
export const ListItem = factory<ListItemFactory>(ListItemComponent, {
  classes,
})
export type {
  ListItemOwnProps,
  ListItemProps,
  ListItemSlots,
  ListItemStylesNames,
  ListItemFactory,
} from './ListItem.types'
