import { defineComponent, h } from 'vue'
import { Stack, Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Stack, Button } from '@mantine-vue/core'
</script>

<template>
  <Stack
    :h="300"
    bg="var(--mantine-color-body)"
    {{props}}
  >
    <Button variant="default">1</Button>
    <Button variant="default">2</Button>
    <Button variant="default">3</Button>
  </Stack>
</template>
`

const Wrapper = defineComponent({
  name: 'StackConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Stack, { h: 300, bg: 'var(--mantine-color-body)', ...attrs }, () => [
        h(Button, { variant: 'default' }, { default: () => '1' }),
        h(Button, { variant: 'default' }, { default: () => '2' }),
        h(Button, { variant: 'default' }, { default: () => '3' }),
      ])
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  dimmed: true,
  controls: [
    {
      prop: 'align',
      type: 'select',
      data: [
        { label: 'stretch', value: 'stretch' },
        { label: 'center', value: 'center' },
        { label: 'flex-start', value: 'flex-start' },
        { label: 'flex-end', value: 'flex-end' },
      ],
      initialValue: 'stretch',
      libraryValue: null,
    },
    {
      prop: 'justify',
      type: 'select',
      data: [
        { label: 'center', value: 'center' },
        { label: 'flex-start', value: 'flex-start' },
        { label: 'flex-end', value: 'flex-end' },
        { label: 'space-between', value: 'space-between' },
        { label: 'space-around', value: 'space-around' },
      ],
      initialValue: 'center',
      libraryValue: null,
    },
    { prop: 'gap', type: 'size', initialValue: 'md', libraryValue: null },
  ],
}
