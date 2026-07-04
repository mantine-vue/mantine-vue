import { defineComponent, h } from 'vue'
import { Slider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider, Text } from '@mantine-vue/core'

const marks = [
  { value: 0, label: 'xs' },
  { value: 25, label: 'sm' },
  { value: 50, label: 'md' },
  { value: 75, label: 'lg' },
  { value: 100, label: 'xl' },
]
</script>

<template>
  <Text>Decimal step</Text>
  <Slider
    :default-value="0"
    :min="-10"
    :max="10"
    :label="(value) => value.toFixed(1)"
    :step="0.1"
    :styles="{ markLabel: { display: 'none' } }"
  />

  <Text mt="md">Step matched with marks</Text>
  <Slider
    :default-value="50"
    :label="(val) => marks.find((mark) => mark.value === val)?.label"
    :step="25"
    :marks="marks"
    :styles="{ markLabel: { display: 'none' } }"
  />
</template>
`

const marks = [
  { value: 0, label: 'xs' },
  { value: 25, label: 'sm' },
  { value: 50, label: 'md' },
  { value: 75, label: 'lg' },
  { value: 100, label: 'xl' },
]

const Demo = defineComponent({
  name: 'SliderStepDemo',
  setup: () => () =>
    h('div', null, [
      h(Text, null, { default: () => 'Decimal step' }),
      h(Slider, {
        defaultValue: 0,
        min: -10,
        max: 10,
        label: (value: number) => value.toFixed(1),
        step: 0.1,
        styles: { markLabel: { display: 'none' } },
      }),

      h(Text, { mt: 'md' }, { default: () => 'Step matched with marks' }),
      h(Slider, {
        defaultValue: 50,
        label: (val: number) => marks.find((mark) => mark.value === val)?.label,
        step: 25,
        marks,
        styles: { markLabel: { display: 'none' } },
      }),
    ]),
})

export const step: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
