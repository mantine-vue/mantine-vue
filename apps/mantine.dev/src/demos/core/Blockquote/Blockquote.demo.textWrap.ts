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
  <Blockquote{{props}} :icon="h(PhInfo)" cite="– Forrest Gump">
    Life is like a box of chocolates. You never know what you are gonna get. But whatever you
    get, you should make the most of it and enjoy every moment.
  </Blockquote>
</template>
`

const Wrapper = defineComponent({
  name: 'BlockquoteTextWrapDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Blockquote,
        { icon: h(PhInfo), cite: '– Forrest Gump', ...(attrs as any) },
        {
          default: () =>
            'Life is like a box of chocolates. You never know what you are gonna get. But whatever you get, you should make the most of it and enjoy every moment.',
        },
      )
  },
})

export const textWrap: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'textWrap',
      initialValue: 'wrap',
      libraryValue: '__',
      data: [
        { value: 'wrap', label: 'wrap' },
        { value: 'balance', label: 'balance' },
      ],
    },
  ],
}
