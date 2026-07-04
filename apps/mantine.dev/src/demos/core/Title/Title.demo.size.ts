import { defineComponent, h } from 'vue'
import { Title } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Title } from '@mantine-vue/core'
</script>

<template>
  <Title :order="3" size="h1">H3 heading with h1 font-size</Title>
  <Title size="h4">H1 heading with h4 font-size</Title>
  <Title :size="16">H1 heading with 16px size</Title>
  <Title size="xs">H1 heading with xs size</Title>
</template>
`

const Demo = defineComponent({
  name: 'TitleSizeDemo',
  setup() {
    return () => [
      h(Title, { order: 3, size: 'h1' }, { default: () => 'H3 heading with h1 font-size' }),
      h(Title, { size: 'h4' }, { default: () => 'H1 heading with h4 font-size' }),
      h(Title, { size: 16 }, { default: () => 'H1 heading with 16px size' }),
      h(Title, { size: 'xs' }, { default: () => 'H1 heading with xs size' }),
    ]
  },
})

export const size: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
