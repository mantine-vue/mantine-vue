import { defineComponent, h } from 'vue'
import { PhCrosshair } from '@phosphor-icons/vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCrosshair } from '@phosphor-icons/vue'
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput
    :eyeDropperIcon="h(PhCrosshair, { size: 18 })"
    label="With custom eye dropper icon"
    placeholder="Pick color"
  />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputEyeDropperIconDemo',
  setup: () => () =>
    h(ColorInput, {
      eyeDropperIcon: h(PhCrosshair, { size: 18 }),
      label: 'With custom eye dropper icon',
      placeholder: 'Pick color',
    }),
})

export const eyeDropperIcon: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
