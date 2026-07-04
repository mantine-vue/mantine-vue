import { defineComponent, h } from 'vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <TextInput label="Boolean error" placeholder="Boolean error" error />
  <TextInput
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
  />
</template>
`

const Demo = defineComponent({
  name: 'TextInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(TextInput, { label: 'Boolean error', placeholder: 'Boolean error', error: true }),
      h(TextInput, {
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
