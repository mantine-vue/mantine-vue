import { defineComponent, h } from 'vue'
import { Loader } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Loader } from '@mantine-vue/core'
</script>

<template>
  <Loader{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'LoaderConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Loader, { ...(attrs as any) })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: null },
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' },
    {
      type: 'segmented',
      prop: 'type',
      data: ['oval', 'bars', 'dots'],
      initialValue: 'oval',
      libraryValue: 'oval',
    },
  ],
}
