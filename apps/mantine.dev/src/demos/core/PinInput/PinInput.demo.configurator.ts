import { defineComponent, h } from 'vue'
import { PinInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PinInput } from '@mantine-vue/core'
</script>

<template>
  <PinInput{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'PinInputConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(PinInput, { ...attrs })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { prop: 'length', type: 'number', initialValue: 4, libraryValue: 4, min: 1, max: 5 },
    { prop: 'mask', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'placeholder', type: 'string', initialValue: '○', libraryValue: '○' },
    { prop: 'disabled', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'error', type: 'boolean', initialValue: false, libraryValue: false },
    {
      prop: 'type',
      type: 'select',
      initialValue: 'alphanumeric',
      libraryValue: 'alphanumeric',
      data: ['alphanumeric', 'number'],
    },
  ],
}
