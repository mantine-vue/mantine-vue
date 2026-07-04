import { defineComponent, h } from 'vue'
import { TreeSelect } from '@mantine-vue/core'
import type { ConfiguratorControlOptions, MantineDemo } from '@/demo'
import { data } from './data'

const code = `
<script setup lang="ts">
import { TreeSelect } from '@mantine-vue/core'
import { data } from './data'
</script>

<template>
  <TreeSelect
    {{props}}
    placeholder="Pick value"
    :data="data"
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
  { type: 'string', prop: 'label', initialValue: 'TreeSelect label', libraryValue: '' },
  { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
  { type: 'string', prop: 'description', initialValue: '', libraryValue: '' },
  { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
]

const Demo = defineComponent({
  name: 'TreeSelectConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(TreeSelect, {
        placeholder: 'Pick value',
        data,
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
