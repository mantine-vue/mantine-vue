import { defineComponent, h } from 'vue'
import { Space, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Space, Text } from '@mantine-vue/core'
</script>

<template>
  <div style="display: flex">
    <Text>First part</Text>
    <Space{{props}} />
    <Text>Second part</Text>
  </div>
</template>
`

const Wrapper = defineComponent({
  name: 'SpaceVerticalDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h('div', { style: { display: 'flex' } }, [
        h(Text, {}, { default: () => 'First part' }),
        h(Space, { ...attrs }),
        h(Text, {}, { default: () => 'Second part' }),
      ])
  },
})

export const vertical: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ prop: 'w', type: 'size', initialValue: 'md', libraryValue: '__' }],
}
