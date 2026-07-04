import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider :min="0" :max="1" :min-range="0.2" :step="0.0005" :default-value="[0.2, 0.8]" />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderDecimalDemo',
  setup: () => () =>
    h(RangeSlider, { min: 0, max: 1, minRange: 0.2, step: 0.0005, defaultValue: [0.2, 0.8] }),
})

export const decimal: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
