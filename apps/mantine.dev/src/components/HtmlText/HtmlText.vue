<script setup lang="ts">
import { computed } from 'vue'
import { Text } from '@mantine-vue/core'
import { replaceMarkdown } from './replace-markdown'

const props = withDefaults(defineProps<{ text: string; fz?: string }>(), { fz: 'sm' })

const html = computed(() => replaceMarkdown(props.text))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component -->
  <Text component="span" class="text" :fz="fz" v-html="html" />
</template>

<style scoped>
.text :deep(code) {
  font-family: var(--mantine-font-family-monospace);
  line-height: var(--mantine-line-height);
  padding: 2px calc(var(--mantine-spacing-xs) / 2);
  border-radius: var(--mantine-radius-sm);
  font-size: var(--mantine-font-size-xs);
  margin: 0;
  background-color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5));
  color: var(--mantine-color-bright);
}

.text :deep(a) {
  color: var(--mantine-color-anchor);
  text-decoration: none;
}

.text :deep(a):hover {
  text-decoration: underline;
}

.text :deep(ul) {
  margin: var(--mantine-spacing-sm) 0;
  padding-left: var(--mantine-spacing-lg);
  margin-top: 3px;
}
</style>
