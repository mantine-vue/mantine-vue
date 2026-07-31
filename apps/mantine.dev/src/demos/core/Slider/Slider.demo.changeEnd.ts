import { defineComponent, h, ref } from 'vue'
import { Box, Slider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Slider, Text, Box } from '@mantine-vue/core'

const value = ref(50)
const endValue = ref(50)
</script>

<template>
  <Box maw="400" mx="auto">
    <Slider v-model="value" @change-end="(v) => (endValue = v)" />

    <Text mt="md" size="sm">
      Current value: <b>{{ value }}</b>
    </Text>
    <Text :mt="5" size="sm">
      Change end value: <b>{{ endValue }}</b>
    </Text>
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'SliderChangeEndDemo',
  setup() {
    const value = ref(50)
    const endValue = ref(50)
    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => [
            h(Slider, {
              modelValue: value.value,
              'onUpdate:modelValue': (v: number) => {
                value.value = v
              },
              onChangeEnd: (v: number) => {
                endValue.value = v
              },
            }),
            h(
              Text,
              { mt: 'md', size: 'sm' },
              {
                default: () => ['Current value: ', h('b', null, String(value.value))],
              },
            ),
            h(
              Text,
              { mt: 5, size: 'sm' },
              {
                default: () => ['Change end value: ', h('b', null, String(endValue.value))],
              },
            ),
          ],
        },
      )
  },
})

export const changeEnd: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
