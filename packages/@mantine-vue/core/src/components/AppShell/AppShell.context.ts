import { createSafeContext } from '../../core'
export interface AppShellContextValue {
  getStyles: (selector: string, options?: any) => any
  withBorder?: boolean
  zIndex?: string | number
  disabled?: boolean
  offsetScrollbars?: boolean
  mode: 'fixed' | 'static'
}
export const [provideAppShellContext, useAppShellContext] = createSafeContext<AppShellContextValue>(
  'AppShell was not found in tree',
)
