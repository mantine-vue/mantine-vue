import { factory } from '../../core'
import { ListItem } from './ListItem/ListItem'
import ListComponent, { varsResolver } from './List.vue'
import type { ListFactory } from './List.types'
import classes from './List.module.css'
export const List = factory<ListFactory>(ListComponent, {
  classes,
  varsResolver,
  Item: ListItem,
})
export type {
  ListCssVariables,
  ListOwnProps,
  ListProps,
  ListSlots,
  ListStylesNames,
  ListFactory,
} from './List.types'
