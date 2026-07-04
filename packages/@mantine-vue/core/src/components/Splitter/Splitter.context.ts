import { createSafeContext } from '../../core'

export interface SplitterContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  readonly sizes: number[]
  readonly collapsed: boolean[]
  readonly orientation: 'horizontal' | 'vertical'
}

export const [provideSplitterContext, useSplitterContext] = createSafeContext<SplitterContextValue>(
  'Splitter component was not found in the tree',
)
