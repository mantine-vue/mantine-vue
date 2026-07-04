import { defineComponent, h } from 'vue'
import { Group, Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, Button } from '@mantine-vue/core'
</script>

<template>
  <Group{{props}}>
    <Button variant="default">First</Button>
    <Button variant="default">Second</Button>
    <Button variant="default">Third</Button>
  </Group>
</template>
`

const Wrapper = defineComponent({
  name: 'GroupUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Group, { ...attrs }, () => [
        h(Button, { variant: 'default' }, { default: () => 'First' }),
        h(Button, { variant: 'default' }, { default: () => 'Second' }),
        h(Button, { variant: 'default' }, { default: () => 'Third' }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'select',
      prop: 'justify',
      data: ['flex-start', 'center', 'space-between', 'flex-end'],
      initialValue: 'flex-start',
      libraryValue: 'flex-start',
    },
    { type: 'size', prop: 'gap', initialValue: 'md', libraryValue: 'md' },
    { type: 'boolean', prop: 'grow', initialValue: false, libraryValue: false },
  ],
}
