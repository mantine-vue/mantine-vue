import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Custom decimal separator"
    placeholder="You can change it"
    decimalSeparator=","
    :defaultValue="20.573"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputDecimalSeparatorDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Custom decimal separator',
      placeholder: 'You can change it',
      decimalSeparator: ',',
      defaultValue: 20.573,
    }),
})

export const decimalSeparator: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
