<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { provideCodeHighlightAdapterContext } from './CodeHighlightProvider'
import type { CodeHighlightAdapterProviderProps } from './CodeHighlightProvider.types'

defineOptions({ name: 'CodeHighlightAdapterProvider' })
const props = defineProps<CodeHighlightAdapterProviderProps>()
const context = ref<any>(null)
const contextLoaded = ref(false)
const loadedLanguages = ref<string[]>([])
const requestedLanguages = new Set<string>()
let generation = 0
const highlight = computed(() => props.adapter.getHighlighter(context.value))

watch(
  () => props.adapter,
  async (adapter) => {
    const currentGeneration = ++generation
    context.value = null
    contextLoaded.value = !adapter.loadContext
    loadedLanguages.value = []
    requestedLanguages.clear()
    if (adapter.loadContext) {
      const value = await adapter.loadContext()
      if (currentGeneration === generation) {
        context.value = value
        contextLoaded.value = true
      }
    }
  },
  { immediate: true },
)

function loadLanguage(language: string | undefined) {
  if (
    !contextLoaded.value ||
    !language ||
    !props.adapter.loadLanguage ||
    requestedLanguages.has(language)
  ) {
    return
  }
  const currentGeneration = generation
  requestedLanguages.add(language)
  let result: Promise<any> | undefined
  try {
    result = props.adapter.loadLanguage(context.value, language)
  } catch {
    requestedLanguages.delete(language)
    return
  }
  result?.then(
    () => {
      if (currentGeneration === generation && !loadedLanguages.value.includes(language)) {
        loadedLanguages.value = [...loadedLanguages.value, language]
      }
    },
    () => currentGeneration === generation && requestedLanguages.delete(language),
  )
}

provideCodeHighlightAdapterContext({
  get adapter() {
    return props.adapter
  },
  get highlight() {
    return highlight.value
  },
  loadLanguage,
  isLanguageLoaded: (language) =>
    !language || !props.adapter.loadLanguage || loadedLanguages.value.includes(language),
})
</script>

<template>
  <div style="display: contents"><slot /></div>
</template>
