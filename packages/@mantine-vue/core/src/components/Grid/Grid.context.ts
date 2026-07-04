import { createSafeContext } from '../../core'

export type GridBreakpoints = Record<string, string>

export interface GridContextValue {
  getStyles: (selector: string, options?: { className?: any; style?: any }) => any
  grow?: boolean
  columns: number
  breakpoints?: GridBreakpoints
  type?: 'container' | 'media'
}

export const [provideGridContext, useGridContext] = createSafeContext<GridContextValue>(
  'Grid component was not found in tree',
)
