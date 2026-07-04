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
  name: 'LoaderSizeDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Loader, { ...(attrs as any) })
  },
})

export const size: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  minHeight: 70,
  controls: [
    { type: 'number', prop: 'size', initialValue: 30, min: 10, max: 50, libraryValue: '__none__' },
  ],
}
