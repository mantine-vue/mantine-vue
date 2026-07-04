import { defineComponent, h } from 'vue'
import { List } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { List } from '@mantine-vue/core'
</script>

<template>
  <List type="ordered">
    <List.Item>First item</List.Item>
    <List.Item :value="5">This item is #5</List.Item>
    <List.Item>This item is #6 (continues from previous)</List.Item>
    <List.Item :value="10">This item is #10</List.Item>
    <List.Item>This item is #11</List.Item>
  </List>
</template>
`

const Demo = defineComponent({
  name: 'ListValueDemo',
  setup() {
    return () =>
      h(
        List,
        { type: 'ordered' },
        {
          default: () => [
            h(List.Item, {}, { default: () => 'First item' }),
            h(List.Item, { value: 5 }, { default: () => 'This item is #5' }),
            h(List.Item, {}, { default: () => 'This item is #6 (continues from previous)' }),
            h(List.Item, { value: 10 }, { default: () => 'This item is #10' }),
            h(List.Item, {}, { default: () => 'This item is #11' }),
          ],
        },
      )
  },
})

export const value: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
