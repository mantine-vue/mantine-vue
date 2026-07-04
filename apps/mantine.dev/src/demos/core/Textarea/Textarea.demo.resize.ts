import { defineComponent, h } from 'vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea resize="vertical" label="Resizable" placeholder="Your comment" />
</template>
`

const Demo = defineComponent({
  name: 'TextareaResizeDemo',
  setup: () => () =>
    h(Textarea, { resize: 'vertical', label: 'Resizable', placeholder: 'Your comment' }),
})

export const resize: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
