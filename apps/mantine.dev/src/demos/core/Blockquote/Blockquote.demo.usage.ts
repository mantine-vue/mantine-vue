import { defineComponent, h } from 'vue'
import { Blockquote } from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Blockquote } from '@mantine-vue/core'
import { PhInfo } from '@phosphor-icons/vue'
</script>

<template>
  <Blockquote{{props}} cite="– Forrest Gump" :icon="h(PhInfo)" mt="xl">
    Life is like an npm install – you never know what you are going to get.
  </Blockquote>
</template>
`

const Wrapper = defineComponent({
  name: 'BlockquoteUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Blockquote,
        { cite: '– Forrest Gump', icon: h(PhInfo), mt: 'xl', ...(attrs as any) },
        {
          default: () => 'Life is like an npm install – you never know what you are going to get.',
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 380,
  controls: [
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: null },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    {
      type: 'number',
      prop: 'iconSize',
      initialValue: 38,
      min: 30,
      max: 60,
      step: 1,
      libraryValue: '__',
    },
  ],
}
