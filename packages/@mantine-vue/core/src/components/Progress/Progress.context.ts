import { createSafeContext } from '../../core'

export interface ProgressContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any; props?: any }) => any
  autoContrast?: boolean
}

export const [provideProgressContext, useProgressContext] = createSafeContext<ProgressContextValue>(
  'Progress.Root component was not found in tree',
)
