import { factory } from '../../../core'
import TabsListComponent from './TabsList.vue'
import type { TabsListFactory } from './TabsList.types'

export const TabsList = factory<TabsListFactory>(TabsListComponent)

export type {
  TabsListFactory,
  TabsListOwnProps,
  TabsListProps,
  TabsListSlots,
  TabsListStylesNames,
} from './TabsList.types'
