import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    {{props}}
    placeholder="Autocomplete placeholder"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Autocomplete, {
        placeholder: 'Autocomplete placeholder',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        ...attrs,
      })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
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
