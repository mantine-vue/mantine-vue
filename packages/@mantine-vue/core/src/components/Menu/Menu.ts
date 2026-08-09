import MenuComponent from './Menu.vue'
import MenuCheckboxItemComponent from './MenuCheckboxItem.vue'
import MenuContextMenuComponent from './MenuContextMenu.vue'
import MenuDividerComponent from './MenuDivider.vue'
import MenuDropdownComponent from './MenuDropdown.vue'
import MenuItemComponent from './MenuItem.vue'
import MenuLabelComponent from './MenuLabel.vue'
import MenuRadioItemComponent from './MenuRadioItem.vue'
import MenuSearchComponent from './MenuSearch.vue'
import MenuSubComponent from './MenuSub.vue'
import MenuSubDropdownComponent from './MenuSubDropdown.vue'
import MenuSubItemComponent from './MenuSubItem.vue'
import MenuSubTargetComponent from './MenuSubTarget.vue'
import MenuTargetComponent from './MenuTarget.vue'
import { createMenuSelectGroup } from './create-menu-select-group'
import { MenuCheckboxGroupKey, MenuRadioGroupKey } from './Menu.select-context'
import classes from './Menu.module.css'

export const MenuTarget = MenuTargetComponent
export const MenuDropdown = MenuDropdownComponent
export const MenuItem = MenuItemComponent
export const MenuLabel = MenuLabelComponent
export const MenuDivider = MenuDividerComponent
export const MenuSearch = MenuSearchComponent
export const MenuCheckboxItem = MenuCheckboxItemComponent
export const MenuRadioItem = MenuRadioItemComponent
export const MenuContextMenu = MenuContextMenuComponent
export const MenuSubTarget = MenuSubTargetComponent
export const MenuSubDropdown = MenuSubDropdownComponent
export const MenuSubItem = MenuSubItemComponent

export const MenuCheckboxGroup = createMenuSelectGroup(MenuCheckboxGroupKey, true)
export const MenuRadioGroup = createMenuSelectGroup(MenuRadioGroupKey, false)

export const MenuSub = Object.assign(MenuSubComponent, {
  Target: MenuSubTarget,
  Dropdown: MenuSubDropdown,
  Item: MenuSubItem,
})

export const Menu = Object.assign(MenuComponent, {
  classes,
  Item: MenuItem,
  Label: MenuLabel,
  Dropdown: MenuDropdown,
  Target: MenuTarget,
  Divider: MenuDivider,
  Search: MenuSearch,
  Sub: MenuSub,
  CheckboxItem: MenuCheckboxItem,
  CheckboxGroup: MenuCheckboxGroup,
  RadioItem: MenuRadioItem,
  RadioGroup: MenuRadioGroup,
  ContextMenu: MenuContextMenu,
})

export type {
  MenuCheckIconSlotProps,
  MenuCheckboxGroupProps,
  MenuCheckboxItemProps,
  MenuCheckboxItemSlots,
  MenuContextMenuProps,
  MenuDividerProps,
  MenuDropdownProps,
  MenuItemProps,
  MenuItemSlots,
  MenuLabelProps,
  MenuProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRadioItemSlots,
  MenuSearchProps,
  MenuSlots,
  MenuStylesNames,
  MenuSubDropdownProps,
  MenuSubItemProps,
  MenuSubProps,
  MenuSubTargetProps,
  MenuTargetProps,
} from './Menu.types'
