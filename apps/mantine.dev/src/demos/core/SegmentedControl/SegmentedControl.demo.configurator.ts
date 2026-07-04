import { defineComponent, h } from 'vue'
import { SegmentedControl } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SegmentedControl } from '@mantine-vue/core'
</script>

<template>
  <SegmentedControl{{props}} :data="['React', 'Angular', 'Vue', 'Svelte']" />
</template>
`

const Demo = defineComponent({
  name: 'SegmentedControlConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(SegmentedControl, {
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        ...attrs,
      })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [{ prop: 'color', type: 'color', initialValue: 'blue', libraryValue: null }],
}
