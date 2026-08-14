import { factory } from '../../core'
import MenubarComponent from './Menubar.vue'
import type { MenubarFactory } from './Menubar.types'
import { MenubarDropdown } from './MenubarDropdown/MenubarDropdown'
import { MenubarMenu } from './MenubarMenu/MenubarMenu'
import { MenubarTarget } from './MenubarTarget/MenubarTarget'
import classes from './Menubar.module.css'

export const Menubar = factory<MenubarFactory>(MenubarComponent, {
  classes,
  Menu: MenubarMenu,
  Target: MenubarTarget,
  Dropdown: MenubarDropdown,
})

export type {
  MenubarOwnProps,
  MenubarProps,
  MenubarSlots,
  MenubarStylesNames,
  MenubarFactory,
} from './Menubar.types'
