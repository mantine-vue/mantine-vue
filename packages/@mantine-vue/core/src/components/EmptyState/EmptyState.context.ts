import { createSafeContext } from '../../core'

export interface EmptyStateContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any
  withIndicatorBackground: boolean | undefined
}

export const [provideEmptyStateContext, useEmptyStateContext] =
  createSafeContext<EmptyStateContextValue>('EmptyState component was not found in tree')
