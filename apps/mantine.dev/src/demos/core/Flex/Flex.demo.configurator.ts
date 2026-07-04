import { defineComponent, h } from 'vue'
import { Flex, Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Flex, Button } from '@mantine-vue/core'
</script>

<template>
  <Flex
    :mih="50"
    bg="rgba(0, 0, 0, .3)"
    {{props}}
  >
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </Flex>
</template>
`

const Wrapper = defineComponent({
  name: 'FlexConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Flex, { mih: 50, bg: 'rgba(0, 0, 0, .3)', ...attrs }, () => [
        h(Button, {}, { default: () => 'Button 1' }),
        h(Button, {}, { default: () => 'Button 2' }),
        h(Button, {}, { default: () => 'Button 3' }),
      ])
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'gap', type: 'size', initialValue: 'md', libraryValue: null },
    {
      prop: 'justify',
      type: 'select',
      data: [
        { value: 'flex-start', label: 'flex-start' },
        { value: 'center', label: 'center' },
        { value: 'flex-end', label: 'flex-end' },
      ],
      initialValue: 'flex-start',
      libraryValue: null,
    },
    {
      prop: 'align',
      type: 'select',
      data: [
        { value: 'flex-start', label: 'flex-start' },
        { value: 'center', label: 'center' },
        { value: 'flex-end', label: 'flex-end' },
      ],
      initialValue: 'flex-start',
      libraryValue: null,
    },
    {
      prop: 'direction',
      type: 'select',
      data: [
        { value: 'row', label: 'row' },
        { value: 'column', label: 'column' },
        { value: 'row-reverse', label: 'row-reverse' },
        { value: 'column-reverse', label: 'column-reverse' },
      ],
      initialValue: 'row',
      libraryValue: null,
    },
    {
      prop: 'wrap',
      type: 'select',
      data: [
        { value: 'wrap', label: 'wrap' },
        { value: 'nowrap', label: 'nowrap' },
        { value: 'wrap-reverse', label: 'wrap-reverse' },
      ],
      initialValue: 'wrap',
      libraryValue: null,
    },
  ],
}
