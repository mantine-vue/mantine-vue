import { defineComponent, h } from 'vue'
import { RangeSlider, Slider, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider, Slider, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Slider
      restrict-to-marks
      :default-value="25"
      :marks="Array.from({ length: 5 }).map((_, index) => ({ value: index * 25 }))"
    />

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
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'SliderRestrictToMarksDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Slider, {
          restrictToMarks: true,
          defaultValue: 25,
          marks: Array.from({ length: 5 }).map((_, index) => ({ value: index * 25 })),
        }),
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
