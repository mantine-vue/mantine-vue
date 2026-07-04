import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider
    :start-point-value="0"
    :min="-100"
    :max="100"
    :default-value="40"
    :marks="[
      { value: -100, label: '-100' },
      { value: -50, label: '-50' },
      { value: 0, label: '0' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderStartPointDemo',
  setup: () => () =>
    h(Slider, {
      startPointValue: -50,
      min: -100,
      max: 100,
      defaultValue: 40,
      mb: 40,
      marks: [
        { value: -100, label: '-100' },
        { value: -50, label: '-50' },
        { value: 0, label: '0' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ],
    }),
})

export const startPoint: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
