import { defineComponent, h } from 'vue'
import { SemiCircleProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SemiCircleProgress } from '@mantine-vue/core'
</script>

<template>
  <SemiCircleProgress{{props}} label="Label" />
</template>
`

const Wrapper = defineComponent({
  name: 'SemiCircleProgressUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(SemiCircleProgress, { label: 'Label', value: 40, ...(attrs as any) })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'fillDirection',
      initialValue: 'left-to-right',
      data: [
        { label: 'Right to left', value: 'right-to-left' },
        { label: 'Left to right', value: 'left-to-right' },
      ],
      libraryValue: null,
    },
    {
      type: 'segmented',
      prop: 'orientation',
      initialValue: 'up',
      data: [
        { label: 'Up', value: 'up' },
        { label: 'Down', value: 'down' },
      ],
      libraryValue: null,
    },
    { type: 'color', prop: 'filledSegmentColor', initialValue: 'blue', libraryValue: null },
    { type: 'number', prop: 'size', min: 120, max: 450, initialValue: 200, libraryValue: null },
    { type: 'number', prop: 'thickness', min: 1, max: 20, initialValue: 12, libraryValue: null },
    { type: 'number', prop: 'value', min: 0, max: 100, initialValue: 40, libraryValue: null },
  ],
}
