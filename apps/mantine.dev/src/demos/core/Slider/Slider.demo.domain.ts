import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider
    :domain="[0, 100]"
    :min="10"
    :max="90"
    :default-value="25"
    :marks="[
      { value: 10, label: 'min' },
      { value: 90, label: 'max' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'SliderDomainDemo',
  setup: () => () =>
    h(Slider, {
      domain: [0, 100],
      min: 10,
      max: 90,
      defaultValue: 25,
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
