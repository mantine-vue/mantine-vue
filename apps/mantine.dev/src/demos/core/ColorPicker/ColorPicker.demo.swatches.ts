import { defineComponent, h } from 'vue'
import { ColorPicker, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

// Default theme colors [6] shade
const themeSwatches = [
  '#2e2e2e',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]

const code = `
<script setup lang="ts">
import { ColorPicker } from '@mantine-vue/core'

const swatches = [
  '#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb',
  '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
  '#40c057', '#82c91e', '#fab005', '#fd7e14',
]
</script>

<template>
  <ColorPicker format="hex" :swatches="swatches" />
</template>
`

const Demo = defineComponent({
  name: 'ColorPickerSwatchesDemo',
  setup: () => () =>
    h(
      Stack,
      { align: 'center' },
      {
        default: () => [
          h(ColorPicker, {
            format: 'hex',
            defaultValue: 'rgba(50, 151, 194, 1)',
            swatches: themeSwatches,
          }),
        ],
      },
    ),
})

export const swatches: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
