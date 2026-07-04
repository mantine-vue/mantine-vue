import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider {{props}} :default-value="20" />
</template>
`

const Demo = defineComponent({
  name: 'SliderThumbSizeDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(Slider, { defaultValue: 20, ...attrs })
  },
})

export const thumbSize: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  maxWidth: 400,
  centered: true,
  controls: [
    { prop: 'thumbSize', type: 'number', min: 16, max: 32, initialValue: 14, libraryValue: null },
  ],
}
