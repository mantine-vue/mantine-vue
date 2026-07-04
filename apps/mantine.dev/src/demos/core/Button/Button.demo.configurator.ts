import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { interactiveVariantsControl } from '../../shared/variants-data'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
</script>

<template>
  <Button{{props}}>Button</Button>
</template>
`
const Wrapper = defineComponent({
  name: 'ButtonConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Button, { ...attrs }, { default: () => 'Button' })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    interactiveVariantsControl,
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { type: 'size', prop: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { type: 'size', prop: 'radius', initialValue: 'sm', libraryValue: 'sm' },
  ],
}
