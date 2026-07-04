import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput :withEyeDropper="false" label="Without eye dropper" placeholder="Not fun" />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputNoEyeDropperDemo',
  setup: () => () =>
    h(ColorInput, {
      withEyeDropper: false,
      label: 'Without eye dropper',
      placeholder: 'Not fun',
    }),
})

export const noEyeDropper: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
