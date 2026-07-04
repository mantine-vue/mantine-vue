import { defineComponent, h } from 'vue'
import { Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio } from '@mantine-vue/core'
</script>

<template>
  <Radio.Group name="demo" default-value="react">
    <Radio value="react" {{props}} />
  </Radio.Group>
</template>
`

const Demo = defineComponent({
  name: 'RadioConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        Radio.Group,
        { name: 'demo', defaultValue: 'react' },
        {
          default: () => h(Radio, { value: 'react', ...attrs }),
        },
      )
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    {
      prop: 'labelPosition',
      type: 'segmented',
      data: [
        { value: 'right', label: 'Right' },
        { value: 'left', label: 'Left' },
      ],
      initialValue: 'right',
      libraryValue: 'right',
    },
    { prop: 'label', type: 'string', initialValue: 'I cannot be unchecked', libraryValue: '' },
    { prop: 'description', type: 'string', initialValue: '', libraryValue: '' },
    { prop: 'error', type: 'string', initialValue: '', libraryValue: '' },
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    {
      prop: 'variant',
      type: 'segmented',
      data: [
        { value: 'filled', label: 'Filled' },
        { value: 'outline', label: 'Outline' },
      ],
      initialValue: 'filled',
      libraryValue: 'filled',
    },
  ],
}
