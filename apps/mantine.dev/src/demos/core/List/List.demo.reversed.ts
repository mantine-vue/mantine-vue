import { defineComponent, h } from 'vue'
import { List } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { List } from '@mantine-vue/core'
</script>

<template>
  <List type="ordered" reversed>
    <List.Item>This is item #3</List.Item>
    <List.Item>This is item #2</List.Item>
    <List.Item>This is item #1</List.Item>
  </List>
</template>
`

const Demo = defineComponent({
  name: 'ListReversedDemo',
  setup() {
    return () =>
      h(
        List,
        { type: 'ordered', reversed: true },
        {
          default: () => [
            h(List.Item, {}, { default: () => 'This is item #3' }),
            h(List.Item, {}, { default: () => 'This is item #2' }),
            h(List.Item, {}, { default: () => 'This is item #1' }),
          ],
        },
      )
  },
})

export const reversed: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
