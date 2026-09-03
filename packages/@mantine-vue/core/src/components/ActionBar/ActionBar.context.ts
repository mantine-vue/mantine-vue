import { createSafeContext } from '../../core'

export interface ActionBarContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any
  close: () => void
  unstyled?: boolean
}

export const [provideActionBarContext, useActionBarContext] =
  createSafeContext<ActionBarContextValue>('ActionBar component was not found in tree')
