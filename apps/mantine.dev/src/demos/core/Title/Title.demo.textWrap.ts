import { defineComponent, h } from 'vue'
import { Title } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Title } from '@mantine-vue/core'
</script>

<template>
  <Title :order="3"{{props}}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus inventore iusto
    cum dolore molestiae perspiciatis! Totam repudiandae impedit maxime!
  </Title>
</template>
`

const Wrapper = defineComponent({
  name: 'TitleTextWrapDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Title,
        { order: 3, ...(attrs as any) },
        {
          default: () =>
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus inventore iusto cum dolore molestiae perspiciatis! Totam repudiandae impedit maxime!',
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
