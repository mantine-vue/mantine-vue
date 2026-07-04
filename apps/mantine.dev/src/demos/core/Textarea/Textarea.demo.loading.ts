import { defineComponent, h } from 'vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea placeholder="Your comment" loading />
</template>
`

const Demo = defineComponent({
  name: 'TextareaLoadingDemo',
  setup: () => () => h(Textarea, { placeholder: 'Your comment', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
