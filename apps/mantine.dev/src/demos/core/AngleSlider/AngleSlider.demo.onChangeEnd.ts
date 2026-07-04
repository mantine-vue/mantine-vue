import { defineComponent, h, ref } from 'vue'
import { AngleSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { AngleSlider, Text } from '@mantine-vue/core'

const value = ref(0)
const endValue = ref(0)
</script>

<template>
  <AngleSlider
    :value="value"
    @change="(v) => (value = v)"
    @change-end="(v) => (endValue = v)"
  />
  <Text mt="md">Current value: {{ value }}</Text>
  <Text>End value: {{ endValue }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'AngleSliderOnChangeEndDemo',
  setup() {
    const value = ref(0)
    const endValue = ref(0)
    return () =>
      h('div', null, [
        h(AngleSlider, {
          value: value.value,
          onChange: (v: number) => {
            value.value = v
          },
          onChangeEnd: (v: number) => {
            endValue.value = v
          },
        }),
        h(Text, { mt: 'md' }, { default: () => `Current value: ${value.value}` }),
        h(Text, null, { default: () => `End value: ${endValue.value}` }),
      ])
  },
})

export const onChangeEnd: MantineDemo = { type: 'code', component: Demo, code, centered: true }
