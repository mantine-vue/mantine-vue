import { createSafeContext } from '../../core'

export interface TabsContextValue {
  id: string
  value: string | null
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  activateTabWithKeyboard?: boolean
  allowTabDeactivation?: boolean
  onChange: (value: string | null) => void
  getTabId: (value: string) => string
  getPanelId: (value: string) => string
  variant?: string
  color?: string
  radius?: string | number
  inverted?: boolean
  keepMounted?: boolean
  keepMountedMode?: 'activity' | 'display-none'
  placement?: 'right' | 'left'
  unstyled?: boolean
  getStyles: (
    selector: string,
    options?: {
      className?: any
      style?: any
      classNames?: any
      styles?: any
      props?: any
      variant?: string
    },
  ) => any
}

export const [provideTabsContext, useTabsContext] = createSafeContext<TabsContextValue>(
  'Tabs component was not found in the tree',
)
