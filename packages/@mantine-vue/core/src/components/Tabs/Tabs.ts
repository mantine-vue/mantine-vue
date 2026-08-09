import TabsComponent, { varsResolver } from './Tabs.vue'
import { TabsList } from './TabsList/TabsList'
import { TabsPanel } from './TabsPanel/TabsPanel'
import { TabsTab } from './TabsTab/TabsTab'
import classes from './Tabs.module.css'

export const Tabs = Object.assign(TabsComponent, {
  classes,
  varsResolver,
  Tab: TabsTab,
  Panel: TabsPanel,
  List: TabsList,
})

export type {
  TabsCssVariables,
  TabsEmits,
  TabsOwnProps,
  TabsProps,
  TabsSlots,
  TabsStylesNames,
  TabsVariant,
} from './Tabs.types'
