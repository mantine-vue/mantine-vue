import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Negative number are not allowed"
    placeholder="Do not enter negative numbers"
    :allowNegative="false"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputAllowNegativeDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Negative number are not allowed',
      placeholder: 'Do not enter negative numbers',
      allowNegative: false,
    }),
})

export const allowNegative: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
