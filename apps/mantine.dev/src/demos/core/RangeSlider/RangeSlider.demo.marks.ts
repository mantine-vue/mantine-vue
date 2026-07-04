import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider
    :default-value="[20, 60]"
    :marks="[{ value: 10 }, { value: 40 }, { value: 95 }]"
    :mb="32"
  />

  <RangeSlider
    :mb="32"
    :default-value="[20, 60]"
    :marks="[
      { value: 20, label: '20%' },
      { value: 50, label: '50%' },
      { value: 80, label: '80%' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderMarksDemo',
  setup: () => () =>
    h('div', null, [
      h(RangeSlider, {
        defaultValue: [20, 60],
        marks: [{ value: 10 }, { value: 40 }, { value: 95 }],
        mb: 32,
      }),
      h(RangeSlider, {
        mb: 32,
        defaultValue: [20, 60],
        marks: [
          { value: 20, label: '20%' },
          { value: 50, label: '50%' },
          { value: 80, label: '80%' },
        ],
      }),
    ]),
})

export const marks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
