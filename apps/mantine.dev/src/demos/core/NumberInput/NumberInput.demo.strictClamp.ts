import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Strict clamping between 0 and 100"
    placeholder="Enter a number"
    clampBehavior="strict"
    :min="0"
    :max="100"
  />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputStrictClampDemo',
  setup: () => () =>
    h(NumberInput, {
      label: 'Strict clamping between 0 and 100',
      placeholder: 'Enter a number',
      clampBehavior: 'strict',
      min: 0,
      max: 100,
    }),
})

export const strictClamp: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
