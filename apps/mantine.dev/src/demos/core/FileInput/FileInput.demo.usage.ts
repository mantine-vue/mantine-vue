import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput{{props}} placeholder="Input placeholder" />
</template>
`

const Wrapper = defineComponent({
  name: 'FileInputUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(FileInput, { placeholder: 'Input placeholder', ...attrs })
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
    { type: 'string', prop: 'label', initialValue: 'Input label', libraryValue: '' },
    { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
    { type: 'string', prop: 'description', initialValue: 'Input description', libraryValue: '' },
    { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
  ],
}
