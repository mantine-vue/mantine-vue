import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    {{props}}
    placeholder="TagsInput placeholder"
    :value="['First', 'Second']"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const inputControls: MantineDemo['controls'] = [
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
  { type: 'string', prop: 'label', initialValue: 'TagsInput label', libraryValue: '' },
  { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
  { type: 'string', prop: 'description', initialValue: '', libraryValue: '' },
  { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
]

const Demo = defineComponent({
  name: 'TagsInputConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(TagsInput, {
        placeholder: 'TagsInput placeholder',
        value: ['First', 'Second'],
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
