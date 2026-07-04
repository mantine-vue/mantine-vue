import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider :min="0" :max="1" :step="0.0005" :default-value="0.5535" />
</template>
`

const Demo = defineComponent({
  name: 'SliderDecimalDemo',
  setup: () => () => h(Slider, { min: 0, max: 1, step: 0.0005, defaultValue: 0.5535 }),
})

export const decimal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
