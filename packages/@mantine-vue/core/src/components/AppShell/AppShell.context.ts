import { createSafeContext } from '../../core'
import type { Ref } from 'vue'
import type { AppShellResizeController, AppShellResizeSection } from './AppShell.types'
export interface AppShellContextValue {
  getStyles: (selector: string, options?: any) => any
  withBorder?: boolean
  zIndex?: string | number
  disabled?: boolean
  offsetScrollbars?: boolean
  mode: 'fixed' | 'static'
  resize?: AppShellResizeController
  rootRef: Ref<Element | null>
  resizeOffsets: Partial<Record<AppShellResizeSection, boolean>>
}
export const [provideAppShellContext, useAppShellContext] = createSafeContext<AppShellContextValue>(
  'AppShell was not found in tree',
)
