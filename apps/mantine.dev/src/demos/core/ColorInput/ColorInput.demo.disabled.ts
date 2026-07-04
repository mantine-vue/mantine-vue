import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput disabled label="Disabled input" placeholder="Disabled input" />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputDisabledDemo',
  setup: () => () =>
    h(ColorInput, { disabled: true, label: 'Disabled input', placeholder: 'Disabled input' }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
