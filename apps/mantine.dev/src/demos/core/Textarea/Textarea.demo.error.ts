import { defineComponent, h } from 'vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea label="Boolean error" placeholder="Boolean error" error />
  <Textarea
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
  />
</template>
`

const Demo = defineComponent({
  name: 'TextareaErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(Textarea, { label: 'Boolean error', placeholder: 'Boolean error', error: true }),
      h(Textarea, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid name',
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
