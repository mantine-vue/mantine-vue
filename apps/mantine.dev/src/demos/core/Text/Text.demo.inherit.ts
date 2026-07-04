import { defineComponent, h } from 'vue'
import { Text, Title } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, Title } from '@mantine-vue/core'
</script>

<template>
  <Title :order="3">
    Title in which you want to
    <Text span c="blue" inherit>highlight</Text>
    something
  </Title>
</template>
`

const Demo = defineComponent({
  name: 'TextInheritDemo',
  setup() {
    return () =>
      h(
        Title,
        { order: 3 },
        {
          default: () => [
            'Title in which you want to ',
            h(Text, { span: true, c: 'blue', inherit: true }, { default: () => 'highlight' }),
            ' something',
          ],
        },
      )
  },
})

export const inherit: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
