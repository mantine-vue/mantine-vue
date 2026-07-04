import { defineComponent, h } from 'vue'
import { CloseButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { CloseButton } from '@mantine-vue/core'
</script>

<template>
  <CloseButton{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'CloseButtonUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(CloseButton, { ...attrs })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    {
      prop: 'variant',
      type: 'segmented',
      data: ['transparent', 'subtle'],
      libraryValue: 'subtle',
      initialValue: 'subtle',
    },
  ],
}
