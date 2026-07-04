import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput :withPicker="false" pointer label="Without dropdown" placeholder="Enter value" />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputWithPickerDemo',
  setup: () => () =>
    h(ColorInput, {
      withPicker: false,
      pointer: true,
      label: 'Without dropdown',
      placeholder: 'Enter value',
    }),
})

export const withPicker: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
