import { withBoxProps } from '../../core'
import MenubarComponent from './Menubar.vue'
import { MenubarDropdown } from './MenubarDropdown/MenubarDropdown'
import { MenubarMenu } from './MenubarMenu/MenubarMenu'
import { MenubarTarget } from './MenubarTarget/MenubarTarget'
import classes from './Menubar.module.css'

export const Menubar = withBoxProps(
  Object.assign(MenubarComponent, {
    classes,
    Menu: MenubarMenu,
    Target: MenubarTarget,
    Dropdown: MenubarDropdown,
  }),
)

export type {
  MenubarOwnProps,
  MenubarProps,
  MenubarSlots,
  MenubarStylesNames,
} from './Menubar.types'
