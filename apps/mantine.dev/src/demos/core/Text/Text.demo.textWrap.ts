import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
</script>

<template>
  <Text{{props}}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus inventore iusto
    cum dolore molestiae perspiciatis! Totam repudiandae impedit maxime!
  </Text>
</template>
`

const lorem =
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatibus inventore iusto cum dolore molestiae perspiciatis! Totam repudiandae impedit maxime!'

const Wrapper = defineComponent({
  name: 'TextTextWrapDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Text, { ...(attrs as any) }, { default: () => lorem })
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
