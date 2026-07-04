import { defineComponent, h } from 'vue'
import { Mark, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, Mark } from '@mantine-vue/core'
</script>

<template>
  <Text>
    Highlight <Mark{{props}}>this chunk</Mark> of the text
  </Text>
</template>
`

const Wrapper = defineComponent({
  name: 'MarkUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Text,
        {},
        {
          default: () => [
            'Highlight ',
            h(Mark, { ...(attrs as any) }, { default: () => 'this chunk' }),
            ' of the text',
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [{ prop: 'color', type: 'color', initialValue: 'yellow', libraryValue: 'yellow' }],
}
