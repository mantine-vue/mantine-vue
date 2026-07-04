import { defineComponent, h } from 'vue'
import { RangeSlider, Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider, Slider } from '@mantine-vue/core'

const marks = [
  { value: 20, label: '20%' },
  { value: 50, label: '50%' },
  { value: 80, label: '80%' },
]
</script>

<template>
  <div style="display: flex; gap: 40px;">
    <Slider orientation="vertical" :default-value="45" :marks="marks" />
    <RangeSlider orientation="vertical" :default-value="[25, 65]" :marks="marks" />
  </div>
</template>
`

const marks = [
  { value: 20, label: '20%' },
  { value: 50, label: '50%' },
  { value: 80, label: '80%' },
]

const Demo = defineComponent({
  name: 'SliderVerticalDemo',
  setup: () => () =>
    h('div', { style: { display: 'flex', gap: '40px' } }, [
      h(Slider, { orientation: 'vertical', defaultValue: 45, marks }),
      h(RangeSlider, { orientation: 'vertical', defaultValue: [25, 65], marks }),
    ]),
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
