import { factory } from '../../../core'
import TabsPanelComponent from './TabsPanel.vue'
import type { TabsPanelFactory } from './TabsPanel.types'
import classes from '../Tabs.module.css'

export const TabsPanel = factory<TabsPanelFactory>(TabsPanelComponent, {
  classes,
})

export type {
  TabsPanelFactory,
  TabsPanelOwnProps,
  TabsPanelProps,
  TabsPanelSlots,
  TabsPanelStylesNames,
} from './TabsPanel.types'
