import { createSafeContext } from '../../core'
export interface MenuContextValue {
  opened: boolean
  hasSearch: boolean
  registerSearch: () => () => void
  setSearchExitClear: (callback: (() => void) | null) => void
  toggleDropdown: () => void
  openDropdown: () => void
  closeDropdown: () => void
  closeDropdownImmediately: () => void
  closeOnItemClick: boolean
  loop: boolean
  trigger: 'click' | 'hover' | 'click-hover'
  menuItemTabIndex: -1 | 0
  getStyles: any
  unstyled?: boolean
  alignItemsLabels: 'all' | 'with-indicators' | 'none'
  checkIcon?: any
}
export const [provideMenuContext, useMenuContext] = createSafeContext<MenuContextValue>(
  'Menu component was not found in the tree',
)
