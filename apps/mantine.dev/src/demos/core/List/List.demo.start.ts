import { defineComponent, h } from 'vue'
import { List } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { List } from '@mantine-vue/core'
</script>

<template>
  <List type="ordered" :start="5">
    <List.Item>This is item #5</List.Item>
    <List.Item>This is item #6</List.Item>
    <List.Item>This is item #7</List.Item>
    <List.Item>This is item #8</List.Item>
  </List>
</template>
`

const Demo = defineComponent({
  name: 'ListStartDemo',
  setup() {
    return () =>
      h(
        List,
        { type: 'ordered', start: 5 },
        {
          default: () => [
            h(List.Item, {}, { default: () => 'This is item #5' }),
            h(List.Item, {}, { default: () => 'This is item #6' }),
            h(List.Item, {}, { default: () => 'This is item #7' }),
            h(List.Item, {}, { default: () => 'This is item #8' }),
          ],
        },
      )
  },
})

export const start: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
