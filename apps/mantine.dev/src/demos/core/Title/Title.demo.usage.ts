import { defineComponent, h } from 'vue'
import { Title } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Title } from '@mantine-vue/core'
</script>

<template>
  <Title :order="1">This is h1 title</Title>
  <Title :order="2">This is h2 title</Title>
  <Title :order="3">This is h3 title</Title>
  <Title :order="4">This is h4 title</Title>
  <Title :order="5">This is h5 title</Title>
  <Title :order="6">This is h6 title</Title>
</template>
`

const Demo = defineComponent({
  name: 'TitleUsageDemo',
  setup() {
    return () => [
      h(Title, { order: 1 }, { default: () => 'This is h1 title' }),
      h(Title, { order: 2 }, { default: () => 'This is h2 title' }),
      h(Title, { order: 3 }, { default: () => 'This is h3 title' }),
      h(Title, { order: 4 }, { default: () => 'This is h4 title' }),
      h(Title, { order: 5 }, { default: () => 'This is h5 title' }),
      h(Title, { order: 6 }, { default: () => 'This is h6 title' }),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
