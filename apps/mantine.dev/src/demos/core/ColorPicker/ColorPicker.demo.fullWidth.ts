import { defineComponent, h } from 'vue'
import { ColorPicker } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorPicker } from '@mantine-vue/core'
</script>

<template>
  <ColorPicker fullWidth size="lg" format="rgba" />
</template>
`

const Demo = defineComponent({
  name: 'ColorPickerFullWidthDemo',
  setup: () => () => h(ColorPicker, { fullWidth: true, size: 'lg', format: 'rgba' }),
})

export const fullWidth: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
