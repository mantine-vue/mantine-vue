import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="You can enter only 2 digits after decimal point"
    placeholder="Do not enter more than 2"
    :decimalScale="2"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputDecimalScaleDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'You can enter only 2 digits after decimal point',
      placeholder: 'Do not enter more than 2',
      decimalScale: 2,
    }),
})

export const decimalScale: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
