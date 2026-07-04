import { defineComponent, h } from 'vue'
import { ColorSwatch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorSwatch } from '@mantine-vue/core'
</script>

<template>
  <ColorSwatch color="rgba(255, 255, 255, 0.7)"{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorSwatchShadowDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(ColorSwatch, { color: 'rgba(255, 255, 255, 0.7)', ...(attrs as any) })
  },
})

export const shadow: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [{ type: 'boolean', prop: 'withShadow', initialValue: true, libraryValue: true }],
}
