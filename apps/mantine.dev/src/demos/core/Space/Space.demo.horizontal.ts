import { defineComponent, h } from 'vue'
import { Space, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Space, Text } from '@mantine-vue/core'
</script>

<template>
  <Text>First line</Text>
  <Space{{props}} />
  <Text>Second line</Text>
</template>
`

const Wrapper = defineComponent({
  name: 'SpaceHorizontalDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h('div', [
        h(Text, {}, { default: () => 'First line' }),
        h(Space, { ...attrs }),
        h(Text, {}, { default: () => 'Second line' }),
      ])
  },
})

export const horizontal: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ prop: 'h', type: 'size', initialValue: 'md', libraryValue: '__' }],
}
