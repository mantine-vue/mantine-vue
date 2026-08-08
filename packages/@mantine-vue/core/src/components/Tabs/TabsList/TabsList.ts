import { withBoxProps } from '../../../core'
import TabsListComponent from './TabsList.vue'

export const TabsList = withBoxProps(TabsListComponent)
export type {
  TabsListOwnProps,
  TabsListProps,
  TabsListSlots,
  TabsListStylesNames,
} from './TabsList.types'
