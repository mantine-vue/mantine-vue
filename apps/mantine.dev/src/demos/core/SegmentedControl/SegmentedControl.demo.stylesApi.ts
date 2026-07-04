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
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'input', description: 'Hidden radio input' },
      { selector: 'label', description: 'Label of each item' },
      { selector: 'control', description: 'Control wrapper of each item' },
      { selector: 'indicator', description: 'Active indicator element' },
      { selector: 'innerLabel', description: 'Inner label element' },
    ],
  },
  component: Demo,
  code,
  centered: true,
}
