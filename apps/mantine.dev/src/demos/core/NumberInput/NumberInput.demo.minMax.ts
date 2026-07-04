import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Enter value between 10 and 20"
    placeholder="Don't enter more than 20 and less than 10"
    :min="10"
    :max="20"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputMinMaxDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Enter value between 10 and 20',
      placeholder: "Don't enter more than 20 and less than 10",
      min: 10,
      max: 20,
    }),
})

export const minMax: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
