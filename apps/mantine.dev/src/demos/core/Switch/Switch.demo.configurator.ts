import { defineComponent, h } from 'vue'
import { Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch } from '@mantine-vue/core'
</script>

<template>
  <Switch
    default-checked
    {{props}}
  />
</template>
`

const Demo = defineComponent({
  name: 'SwitchConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Switch, {
        defaultChecked: true,
        ...attrs,
      })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'withThumbIndicator', type: 'boolean', initialValue: true, libraryValue: true },
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
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'radius', type: 'size', initialValue: 'xl', libraryValue: 'xl' },
    { prop: 'disabled', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
