import { defineComponent, h } from 'vue'
import { Kbd } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Kbd } from '@mantine-vue/core'
</script>

<template>
  <Kbd size="sm">Shift</Kbd>
</template>
`

const Wrapper = defineComponent({
  name: 'KbdSizeDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Kbd, { ...(attrs as any) }, { default: () => 'Shift' })
  },
})

export const size: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [{ type: 'size', prop: 'size', initialValue: 'sm', libraryValue: 'sm' }],
}
