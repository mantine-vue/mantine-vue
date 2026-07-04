import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <FileInput label="Boolean error" placeholder="Boolean error" error />
    <FileInput
      mt="md"
      label="With error message"
      placeholder="With error message"
      error="Invalid name"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'FileInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(FileInput, { label: 'Boolean error', placeholder: 'Boolean error', error: true }),
      h(FileInput, {
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
