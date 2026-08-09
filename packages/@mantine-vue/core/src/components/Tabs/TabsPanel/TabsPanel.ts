import { withBoxProps } from '../../../core'
import TabsPanelComponent from './TabsPanel.vue'
import classes from '../Tabs.module.css'

export const TabsPanel = withBoxProps(TabsPanelComponent)
Object.assign(TabsPanel, { classes })

export type {
  TabsPanelOwnProps,
  TabsPanelProps,
  TabsPanelSlots,
  TabsPanelStylesNames,
} from './TabsPanel.types'
