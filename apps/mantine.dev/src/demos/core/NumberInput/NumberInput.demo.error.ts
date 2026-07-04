import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput label="Boolean error" placeholder="Boolean error" error />
  <NumberInput
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(NumberInput, {
        label: 'Boolean error',
        placeholder: 'Boolean error',
        error: true,
      }),
      h(NumberInput, {
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
