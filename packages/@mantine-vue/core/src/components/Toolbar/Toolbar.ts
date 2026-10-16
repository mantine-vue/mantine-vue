import { factory } from '../../core'
import ToolbarComponent, { varsResolver } from './Toolbar.vue'
import ToolbarGroup from './ToolbarGroup.vue'
import ToolbarToggle from './ToolbarToggle.vue'
import ToolbarToggleGroup from './ToolbarToggleGroup.vue'
import ToolbarToggleItem from './ToolbarToggleItem.vue'
import ToolbarDivider from './ToolbarDivider.vue'
import type { ToolbarFactory } from './Toolbar.types'
import classes from './Toolbar.module.css'

export { ToolbarGroup, ToolbarToggle, ToolbarToggleGroup, ToolbarToggleItem, ToolbarDivider }
export const Toolbar = factory<ToolbarFactory>(ToolbarComponent, {
  classes,
  varsResolver,
  Group: ToolbarGroup,
  Toggle: ToolbarToggle,
  ToggleGroup: ToolbarToggleGroup,
  ToggleItem: ToolbarToggleItem,
  Divider: ToolbarDivider,
})
export type * from './Toolbar.types'
