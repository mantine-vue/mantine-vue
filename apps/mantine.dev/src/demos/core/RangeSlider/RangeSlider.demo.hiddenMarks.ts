import { defineComponent, h, ref } from 'vue'
import { Box, RangeSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { RangeSlider, Text, Box } from '@mantine-vue/core'

const value = ref<[number, number]>([25, 75])
</script>

<template>
  <Box pb="md">
    <Text size="sm" mb="xs">
      Hidden marks allow you to snap to specific values without displaying them visually. Current
      value: [{{ value[0] }}, {{ value[1] }}]
    </Text>
    <RangeSlider
      :value="value"
      @change="(v) => (value = v)"
      :min="0"
      :max="100"
      :step="1"
      :min-range="10"
      restrict-to-marks
      :marks="[
        { value: 0, label: '0%' },
        { value: 20, hidden: true },
        { value: 40, hidden: true },
        { value: 50, label: '50%' },
        { value: 60, hidden: true },
        { value: 80, hidden: true },
        { value: 100, label: '100%' },
      ]"
    />
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderHiddenMarksDemo',
  setup() {
    const value = ref<[number, number]>([25, 75])
    return () =>
      h(
        Box,
        { pb: 'md' },
        {
          default: () => [
            h(
              Text,
              { size: 'sm', mb: 'xs' },
              {
                default: () =>
                  `Hidden marks allow you to snap to specific values without displaying them visually. Current value: [${value.value[0]}, ${value.value[1]}]`,
              },
            ),
            h(RangeSlider, {
              value: value.value,
              onChange: (v: [number, number]) => {
                value.value = v
              },
              min: 0,
              max: 100,
              step: 1,
              minRange: 10,
              restrictToMarks: true,
              marks: [
                { value: 0, label: '0%' },
                { value: 20, hidden: true },
                { value: 40, hidden: true },
                { value: 50, label: '50%' },
                { value: 60, hidden: true },
                { value: 80, hidden: true },
                { value: 100, label: '100%' },
              ],
            }),
          ],
        },
      )
  },
})

export const hiddenMarks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
