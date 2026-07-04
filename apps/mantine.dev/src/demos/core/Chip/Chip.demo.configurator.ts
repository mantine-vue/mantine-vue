import { defineComponent, h } from 'vue'
import { Chip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Chip } from '@mantine-vue/core'
</script>

<template>
  <Chip defaultChecked{{props}}>Awesome chip</Chip>
</template>
`

const Wrapper = defineComponent({
  name: 'ChipConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Chip, { defaultChecked: true, ...attrs }, { default: () => 'Awesome chip' })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    {
      prop: 'variant',
      type: 'segmented',
      data: [
        { value: 'filled', label: 'Filled' },
        { value: 'outline', label: 'Outline' },
        { value: 'light', label: 'Light' },
      ],
      initialValue: 'filled',
      libraryValue: 'filled',
    },
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'radius', type: 'size', initialValue: 'xl', libraryValue: 'xl' },
  ],
}
