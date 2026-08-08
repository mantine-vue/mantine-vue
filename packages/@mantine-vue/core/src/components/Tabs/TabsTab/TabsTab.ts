import { withBoxProps } from '../../../core'
import TabsTabComponent from './TabsTab.vue'
import classes from '../Tabs.module.css'

export const TabsTab = withBoxProps(Object.assign(TabsTabComponent, { classes }))

export type {
  TabsTabOwnProps,
  TabsTabProps,
  TabsTabSlots,
  TabsTabStylesNames,
} from './TabsTab.types'
