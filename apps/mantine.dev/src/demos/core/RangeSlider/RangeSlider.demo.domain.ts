import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider
    :domain="[0, 100]"
    :min="10"
    :max="90"
    :default-value="[25, 75]"
    :marks="[
      { value: 10, label: 'min' },
      { value: 90, label: 'max' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderDomainDemo',
  setup: () => () =>
    h(RangeSlider, {
      domain: [0, 100],
      min: 10,
      max: 90,
      defaultValue: [25, 75],
      mb: 40,
      marks: [
        { value: 10, label: 'min' },
        { value: 90, label: 'max' },
      ],
    }),
})

export const domain: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 400,
  centered: true,
}
