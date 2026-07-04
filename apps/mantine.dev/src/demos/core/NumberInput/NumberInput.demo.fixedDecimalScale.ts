import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Always show 2 digits after decimal point"
    placeholder="Do not enter more that 2"
    :decimalScale="2"
    fixedDecimalScale
    :defaultValue="2.2"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputFixedDecimalScaleDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Always show 2 digits after decimal point',
      placeholder: 'Do not enter more that 2',
      decimalScale: 2,
      fixedDecimalScale: true,
      defaultValue: 2.2,
    }),
})

export const fixedDecimalScale: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
