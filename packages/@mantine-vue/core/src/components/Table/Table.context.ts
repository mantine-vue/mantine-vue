import { createSafeContext } from '../../core'

export interface TableContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any; props?: any }) => any
  stickyHeader?: boolean
  striped?: 'odd' | 'even'
  highlightOnHover?: boolean
  withColumnBorders?: boolean
  withRowBorders?: boolean
  captionSide: 'top' | 'bottom'
}

export const [provideTableContext, useTableContext] = createSafeContext<TableContextValue>(
  'Table component was not found in the tree',
)
