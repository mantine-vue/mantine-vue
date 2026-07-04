import { createSafeContext } from '@mantine-vue/core'

export interface CodeHighlightContextValue {
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  codeColorScheme: 'light' | 'dark' | (string & {}) | undefined
}

export const [provideCodeHighlightContext, useCodeHighlightContext] =
  createSafeContext<CodeHighlightContextValue>(
    'CodeHighlightProvider was not found in the component tree',
  )
