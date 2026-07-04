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
    <Slider :value="value" @change="(v) => (value = v)" @change-end="(v) => (endValue = v)" />

    <Text mt="md" size="sm">
      onChange value: <b>{{ value }}</b>
    </Text>
    <Text :mt="5" size="sm">
      onChangeEnd value: <b>{{ endValue }}</b>
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
              value: value.value,
              onChange: (v: number) => {
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
                default: () => ['onChange value: ', h('b', null, String(value.value))],
              },
            ),
            h(
              Text,
              { mt: 5, size: 'sm' },
              {
                default: () => ['onChangeEnd value: ', h('b', null, String(endValue.value))],
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
