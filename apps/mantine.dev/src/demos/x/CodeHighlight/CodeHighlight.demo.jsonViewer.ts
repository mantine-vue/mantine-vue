import { defineComponent, h } from 'vue'
import { JsonViewer } from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

const data = { framework: 'Vue', version: 3, features: ['reactivity', 'components'], stable: true }
export const jsonViewer: MantineDemo = {
  type: 'code',
  component: defineComponent({ setup: () => () => h(JsonViewer, { value: data }) }),
  code: `<script setup lang="ts">\nimport { JsonViewer } from '@mantine-vue/code-highlight'\nconst data = { framework: 'Vue', version: 3, features: ['reactivity', 'components'] }\n</script>\n\n<template><JsonViewer :value="data" /></template>`,
}
