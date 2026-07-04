import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { makeItems } from './_demo-item'

const code = `
<script setup lang="ts">
import { SimpleGrid } from '@mantine-vue/core'
</script>

<template>
  <SimpleGrid{{props}}>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
  </SimpleGrid>
</template>
`

const Wrapper = defineComponent({
  name: 'SimpleGridUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(SimpleGrid, { ...attrs }, () => makeItems(5))
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'cols', type: 'number', initialValue: 3, min: 1, max: 6, step: 1, libraryValue: '__' },
    { prop: 'spacing', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'verticalSpacing', type: 'size', initialValue: 'md', libraryValue: 'md' },
  ],
}
