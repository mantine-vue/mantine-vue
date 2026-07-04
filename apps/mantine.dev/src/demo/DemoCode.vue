<script setup lang="ts">
import { computed } from 'vue'
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import type { DemoCode as DemoCodeSource, DemoCodeFile } from './types'
import { getCodeFileIcon } from './getCodeFileIcon'

const props = defineProps<{
  code?: DemoCodeSource
  defaultExpanded?: boolean
  maxCollapsedHeight?: number
}>()

// A bare string becomes a single Demo.vue file, otherwise the file list is
// used as-is (defaulting missing per-file fields).
const files = computed<Required<DemoCodeFile>[] | undefined>(() => {
  if (props.code == null) return undefined
  if (typeof props.code === 'string') {
    return [{ fileName: 'Demo.vue', code: props.code, language: 'vue' }]
  }
  return props.code.map((file) => ({
    fileName: file.fileName ?? 'Demo.vue',
    code: file.code,
    language: file.language ?? 'vue',
  }))
})
</script>

<template>
  <CodeHighlightTabs
    v-if="files"
    :code="files"
    :get-file-icon="getCodeFileIcon"
    with-expand-button
    :max-collapsed-height="maxCollapsedHeight"
    :default-expanded="defaultExpanded ?? true"
    :style="{ borderTop: '1px solid var(--mantine-color-default-border)' }"
  />
</template>
