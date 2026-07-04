import { computed, defineComponent, h, inject, onMounted, provide, ref, type PropType } from 'vue'
import { plainTextAdapter } from './adapters/plain-text-adapter'

export interface HighlighterInput {
  colorScheme: 'light' | 'dark' | (string & {})
  code: string
  language?: string
}

export type Highlighter = (input: HighlighterInput) => {
  highlightedCode: string
  isHighlighted: boolean
  codeElementProps?: Record<string, any>
}

export interface CodeHighlightAdapter {
  loadContext?: () => Promise<any>
  getHighlighter: (ctx: any) => Highlighter
}

export interface CodeHighlightProviderContext {
  adapter: CodeHighlightAdapter
  highlight: Highlighter
}

const CodeHighlightContext = Symbol('CodeHighlightContext')

export function provideCodeHighlightAdapterContext(value: CodeHighlightProviderContext) {
  provide(CodeHighlightContext, value)
}

export function useHighlight() {
  const ctx = inject<CodeHighlightProviderContext | null>(CodeHighlightContext, null)
  return ctx?.highlight || plainTextAdapter.getHighlighter(null)
}

export const CodeHighlightAdapterProvider = defineComponent({
  name: 'CodeHighlightAdapterProvider',
  props: {
    adapter: { type: Object as PropType<CodeHighlightAdapter>, required: true },
  },
  setup(props, { slots }) {
    const context = ref<any>(null)
    const highlight = computed(() => props.adapter.getHighlighter(context.value))

    onMounted(() => {
      props.adapter.loadContext?.().then((value) => {
        context.value = value
      })
    })

    provideCodeHighlightAdapterContext({
      adapter: props.adapter,
      get highlight() {
        return highlight.value
      },
    })

    return () => h('div', { style: { display: 'contents' } }, slots.default?.())
  },
})
