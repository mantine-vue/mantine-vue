import { defineComponent, h } from 'vue'
import { Input } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Input } from '@mantine-vue/core'
</script>

<template>
  <Input{{props}} placeholder="Input component" />
</template>
`

const Wrapper = defineComponent({
  name: 'InputUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Input, { placeholder: 'Input component', ...attrs })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
  controls: [
    {
      type: 'segmented',
      prop: 'variant',
      data: ['default', 'filled', 'unstyled'],
      initialValue: 'default',
      libraryValue: 'default',
    },
    { type: 'size', prop: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    { type: 'boolean', prop: 'disabled', initialValue: false, libraryValue: false },
    { type: 'boolean', prop: 'error', initialValue: false, libraryValue: false },
  ],
}
