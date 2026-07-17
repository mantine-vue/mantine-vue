import { createSafeContext } from '../../core'

export interface DataListContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => any
}

export const [provideDataListContext, useDataListContext] = createSafeContext<DataListContextValue>(
  'DataList component was not found in tree',
)
