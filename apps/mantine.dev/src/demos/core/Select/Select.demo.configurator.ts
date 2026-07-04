import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { ConfiguratorControlOptions, MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    {{props}}
    placeholder="Select placeholder"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const inputControls: ConfiguratorControlOptions[] = [
  {
    type: 'select',
    prop: 'variant',
    initialValue: 'default',
    libraryValue: 'default',
    data: ['default', 'filled', 'unstyled'],
  },
  {
    type: 'select',
    prop: 'size',
    initialValue: 'sm',
    libraryValue: 'sm',
    data: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    type: 'select',
    prop: 'radius',
    initialValue: 'sm',
    libraryValue: 'sm',
    data: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  { type: 'string', prop: 'label', initialValue: 'Select label', libraryValue: '' },
  { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
  { type: 'string', prop: 'description', initialValue: '', libraryValue: '' },
  { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
]

const Demo = defineComponent({
  name: 'SelectConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Select, {
        placeholder: 'Select placeholder',
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
  controls: inputControls,
}
