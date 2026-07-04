import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Decimals are not allowed"
    placeholder="Do not enter decimal numbers"
    :allowDecimal="false"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputAllowDecimalDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Decimals are not allowed',
      placeholder: 'Do not enter decimal numbers',
      allowDecimal: false,
    }),
})

export const allowDecimal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
