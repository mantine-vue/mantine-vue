import { defineComponent, h } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox } from '@mantine-vue/core'
</script>

<template>
  <Checkbox defaultChecked{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'CheckboxConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Checkbox, { defaultChecked: true, ...attrs })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
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
    { prop: 'label', type: 'string', initialValue: 'I agree to sell my privacy', libraryValue: '' },
    { prop: 'description', type: 'string', initialValue: '', libraryValue: '' },
    { prop: 'error', type: 'string', initialValue: '', libraryValue: '' },
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
    { prop: 'radius', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'disabled', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'indeterminate', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
