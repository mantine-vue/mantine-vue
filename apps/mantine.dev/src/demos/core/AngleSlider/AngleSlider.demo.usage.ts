import { defineComponent, h } from 'vue'
import { AngleSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AngleSlider } from '@mantine-vue/core'
</script>

<template>
  <AngleSlider aria-label="Angle slider"{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'AngleSliderUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(AngleSlider, { 'aria-label': 'Angle slider', ...attrs })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { type: 'number', prop: 'size', initialValue: 60, libraryValue: '__', min: 50, max: 200 },
    { type: 'number', prop: 'thumbSize', initialValue: 8, libraryValue: '__', min: 1, max: 100 },
    { type: 'boolean', prop: 'withLabel', initialValue: true, libraryValue: true },
  ],
}
