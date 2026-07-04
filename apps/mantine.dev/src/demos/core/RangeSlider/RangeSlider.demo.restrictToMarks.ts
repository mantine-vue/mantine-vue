import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider
    restrict-to-marks
    :default-value="[5, 15]"
    :marks="[
      { value: 5 },
      { value: 15 },
      { value: 25 },
      { value: 35 },
      { value: 70 },
      { value: 80 },
      { value: 90 },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderRestrictToMarksDemo',
  setup: () => () =>
    h(RangeSlider, {
      restrictToMarks: true,
      defaultValue: [5, 15],
      marks: [
        { value: 5 },
        { value: 15 },
        { value: 25 },
        { value: 35 },
        { value: 70 },
        { value: 80 },
        { value: 90 },
      ],
    }),
})

export const restrictToMarks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
