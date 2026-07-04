import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider
    {{props}}
    :default-value="[20, 60]"
    :marks="[
      { value: 20, label: '20%' },
      { value: 50, label: '50%' },
      { value: 80, label: '80%' },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(RangeSlider, {
        defaultValue: [20, 60],
        marks: [
          { value: 20, label: '20%' },
          { value: 50, label: '50%' },
          { value: 80, label: '80%' },
        ],
        ...attrs,
      })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: '__none__' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'radius', type: 'size', initialValue: 'xl', libraryValue: 'xl' },
    { prop: 'showLabelOnHover', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'labelAlwaysOn', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
