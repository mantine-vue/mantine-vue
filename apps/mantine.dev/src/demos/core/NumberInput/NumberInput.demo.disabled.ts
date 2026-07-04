import { defineComponent, h } from 'vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput disabled label="Disabled input" placeholder="Disabled input" />
</template>
`

const Demo = defineComponent({
  name: 'NumberInputDisabledDemo',
  setup: () => () =>
    h(NumberInput, {
      disabled: true,
      label: 'Disabled input',
      placeholder: 'Disabled input',
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
