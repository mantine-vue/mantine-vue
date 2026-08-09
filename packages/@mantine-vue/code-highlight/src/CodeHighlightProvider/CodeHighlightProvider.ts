import { inject, provide } from 'vue'
import { plainTextAdapter } from './adapters/plain-text-adapter'
import CodeHighlightAdapterProviderComponent from './CodeHighlightAdapterProvider.vue'
import type { CodeHighlightProviderContext } from './CodeHighlightProvider.types'

const CodeHighlightContext = Symbol('CodeHighlightContext')

export function provideCodeHighlightAdapterContext(value: CodeHighlightProviderContext) {
  provide(CodeHighlightContext, value)
}

export function useHighlight() {
  const ctx = inject<CodeHighlightProviderContext | null>(CodeHighlightContext, null)
  return ctx?.highlight || plainTextAdapter.getHighlighter(null)
}

export const CodeHighlightAdapterProvider = CodeHighlightAdapterProviderComponent
export type * from './CodeHighlightProvider.types'
