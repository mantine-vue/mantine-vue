import { defineComponent, h } from 'vue'
import { RangeSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider, Text } from '@mantine-vue/core'

const marks = [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }]
</script>

<template>
  <Text>Decimal step</Text>
  <RangeSlider :min-range="2" :default-value="[0, 10]" :min="-10" :max="10" :step="0.1" />

  <Text mt="md">Step matched with marks</Text>
  <RangeSlider :default-value="[50, 75]" :step="25" :marks="marks" />
</template>
`

const marks = [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }]

const Demo = defineComponent({
  name: 'RangeSliderStepDemo',
  setup: () => () =>
    h('div', null, [
      h(Text, null, { default: () => 'Decimal step' }),
      h(RangeSlider, { minRange: 2, defaultValue: [0, 10], min: -10, max: 10, step: 0.1 }),

      h(Text, { mt: 'md' }, { default: () => 'Step matched with marks' }),
      h(RangeSlider, { defaultValue: [50, 75], step: 25, marks }),
    ]),
})

export const step: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
