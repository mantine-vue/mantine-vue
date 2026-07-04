import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput
    :fixOnBlur="false"
    label="Value is not fixed on blur"
    placeholder="May contain invalid value"
  />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputFixOnBlurDemo',
  setup: () => () =>
    h(ColorInput, {
      fixOnBlur: false,
      label: 'Value is not fixed on blur',
      placeholder: 'May contain invalid value',
    }),
})

export const fixOnBlur: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
