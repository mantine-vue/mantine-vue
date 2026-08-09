import PopoverComponent, { varsResolver } from './Popover.vue'
import PopoverContextMenuComponent from './PopoverContextMenu.vue'
import PopoverDropdownComponent from './PopoverDropdown.vue'
import PopoverTargetComponent from './PopoverTarget.vue'
import classes from './Popover.module.css'

export const PopoverTarget = PopoverTargetComponent
export const PopoverDropdown = PopoverDropdownComponent
export const PopoverContextMenu = PopoverContextMenuComponent

export const Popover = Object.assign(PopoverComponent, {
  classes,
  varsResolver,
  Target: PopoverTarget,
  Dropdown: PopoverDropdown,
  ContextMenu: PopoverContextMenu,
})

export type {
  PopoverContextMenuProps,
  PopoverContextMenuSlots,
  PopoverCssVariables,
  PopoverDropdownProps,
  PopoverDropdownSlots,
  PopoverMiddlewares,
  PopoverProps,
  PopoverSlots,
  PopoverStylesNames,
  PopoverTargetProps,
  PopoverTargetSlots,
  PopoverWidth,
} from './Popover.types'
