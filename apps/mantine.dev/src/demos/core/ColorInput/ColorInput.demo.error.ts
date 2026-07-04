import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <ColorInput label="Boolean error" placeholder="Boolean error" error />
    <ColorInput
      mt="md"
      label="With error message"
      placeholder="With error message"
      error="Invalid name"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ColorInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(ColorInput, { label: 'Boolean error', placeholder: 'Boolean error', error: true }),
      h(ColorInput, {
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
