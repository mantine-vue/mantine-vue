import { defineComponent, h } from 'vue'
import { Highlight } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight } from '@mantine-vue/core'
</script>

<template>
  <Highlight{{props}}>
    Highlight This, definitely THIS and also this!
  </Highlight>
</template>
`

const Wrapper = defineComponent({
  name: 'HighlightUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      const { children, ...rest } = attrs as any
      return h(
        Highlight,
        { maw: 400, mx: 'auto', ...rest },
        { default: () => children ?? 'Highlight This, definitely THIS and also this!' },
      )
    }
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    { prop: 'color', type: 'color', initialValue: 'yellow', libraryValue: 'yellow' },
    { prop: 'highlight', type: 'string', initialValue: 'this', libraryValue: null },
    {
      prop: 'children',
      type: 'string',
      initialValue: 'Highlight This, definitely THIS and also this!',
      libraryValue: null,
    },
  ],
}
