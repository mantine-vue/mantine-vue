import { createSafeContext } from '../../core'

export interface ListContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any }) => any
  center?: boolean
  icon?: any
}

export const [provideListContext, useListContext] = createSafeContext<ListContextValue>(
  'List component was not found in tree',
)
