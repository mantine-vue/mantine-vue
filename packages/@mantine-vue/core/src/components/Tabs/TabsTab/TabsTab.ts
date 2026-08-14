import { factory } from '../../../core'
import TabsTabComponent from './TabsTab.vue'
import type { TabsTabFactory } from './TabsTab.types'
import classes from '../Tabs.module.css'

export const TabsTab = factory<TabsTabFactory>(TabsTabComponent, {
  classes,
})

export type {
  TabsTabOwnProps,
  TabsTabProps,
  TabsTabSlots,
  TabsTabStylesNames,
  TabsTabFactory,
} from './TabsTab.types'
