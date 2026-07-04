import { defineComponent, h } from 'vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea label="Disabled" placeholder="Your comment" disabled />
</template>
`

const Demo = defineComponent({
  name: 'TextareaDisabledDemo',
  setup: () => () =>
    h(Textarea, { label: 'Disabled', placeholder: 'Your comment', disabled: true }),
})

export const disabled: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
