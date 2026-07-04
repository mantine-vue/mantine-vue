import { defineComponent, h, ref } from 'vue'
import { Box, Slider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Slider, Text, Box } from '@mantine-vue/core'

const value = ref(50)
</script>

<template>
  <Box pb="md">
    <Text size="sm" mb="xs">
      Hidden marks allow you to snap to specific values without displaying them visually. Current
      value: {{ value }}
    </Text>
    <Slider
      :value="value"
      @change="(v) => (value = v)"
      :min="0"
      :max="100"
      :step="1"
      restrict-to-marks
      :marks="[
        { value: 0, label: '0%' },
        { value: 25, hidden: true },
        { value: 50, label: '50%' },
        { value: 75, hidden: true },
        { value: 100, label: '100%' },
      ]"
    />
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'SliderHiddenMarksDemo',
  setup() {
    const value = ref(50)
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
                  `Hidden marks allow you to snap to specific values without displaying them visually. Current value: ${value.value}`,
              },
            ),
            h(Slider, {
              value: value.value,
              onChange: (v: number) => {
                value.value = v
              },
              min: 0,
              max: 100,
              step: 1,
              restrictToMarks: true,
              marks: [
                { value: 0, label: '0%' },
                { value: 25, hidden: true },
                { value: 50, label: '50%' },
                { value: 75, hidden: true },
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
