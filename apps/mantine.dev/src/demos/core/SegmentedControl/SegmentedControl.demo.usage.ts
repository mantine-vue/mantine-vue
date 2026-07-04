import { defineComponent, h } from 'vue'
import { SegmentedControl } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl } from '@mantine-vue/core'
</script>

<template>
  <SegmentedControl{{props}} :data="['React', 'Angular', 'Vue']" />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlUsageDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(SegmentedControl, {
        data: ['React', 'Angular', 'Vue'],
        ...attrs,
      })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  controls: [
    {
      prop: 'orientation',
      type: 'segmented',
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
      data: [
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
      ],
    },
    { prop: 'fullWidth', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'withItemsBorders', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
  ],
}
