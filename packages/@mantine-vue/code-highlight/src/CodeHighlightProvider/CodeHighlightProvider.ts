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
  const fallback = plainTextAdapter.getHighlighter(null)
  return (input: Parameters<CodeHighlightProviderContext['highlight']>[0]) =>
    (ctx?.highlight || fallback)(input)
}

export function useLoadLanguage() {
  const ctx = inject<CodeHighlightProviderContext | null>(CodeHighlightContext, null)
  return ctx?.loadLanguage || (() => {})
}

export function useIsLanguageLoaded() {
  const ctx = inject<CodeHighlightProviderContext | null>(CodeHighlightContext, null)
  return ctx?.isLanguageLoaded || (() => true)
}

export const CodeHighlightAdapterProvider = CodeHighlightAdapterProviderComponent
export type * from './CodeHighlightProvider.types'
