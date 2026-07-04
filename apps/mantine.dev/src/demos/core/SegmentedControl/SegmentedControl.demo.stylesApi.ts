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
  name: 'SegmentedControlStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(SegmentedControl, {
        data: ['React', 'Angular', 'Vue'],
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      input: 'Hidden radio input',
      label: 'Label of each item',
      control: 'Control wrapper of each item',
      indicator: 'Active indicator element',
      innerLabel: 'Inner label element',
    },
  },
  component: Demo,
  code,
  centered: true,
}
