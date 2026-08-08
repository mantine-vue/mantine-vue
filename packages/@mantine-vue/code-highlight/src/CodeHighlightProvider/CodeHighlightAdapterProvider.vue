<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { provideCodeHighlightAdapterContext } from './CodeHighlightProvider'
import type { CodeHighlightAdapterProviderProps } from './CodeHighlightProvider.types'

defineOptions({ name: 'CodeHighlightAdapterProvider' })
const props = defineProps<CodeHighlightAdapterProviderProps>()
const context = ref<any>(null)
const highlight = computed(() => props.adapter.getHighlighter(context.value))
onMounted(() =>
  props.adapter.loadContext?.().then((value) => {
    context.value = value
  }),
)
provideCodeHighlightAdapterContext({
  adapter: props.adapter,
  get highlight() {
    return highlight.value
  },
})
</script>

<template>
  <div style="display: contents"><slot /></div>
</template>
