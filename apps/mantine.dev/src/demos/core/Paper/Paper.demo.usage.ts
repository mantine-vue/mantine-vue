import { defineComponent, h } from 'vue'
import { Box, Paper, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Paper, Text } from '@mantine-vue/core'
</script>

<template>
  <Paper{{props}} p="xl">
    <Text>Paper is the most basic ui component</Text>
    <Text>
      Use it to create cards, dropdowns, modals and other components that require background
      with shadow
    </Text>
  </Paper>
</template>
`

const Wrapper = defineComponent({
  name: 'PaperUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Box, { p: 'md' }, () =>
        h(
          Paper,
          { maw: 400, mx: 'auto', p: 'xl', ...(attrs as any) },
          {
            default: () => [
              h(Text, {}, () => 'Paper is the most basic ui component'),
              h(
                Text,
                {},
                () =>
                  'Use it to create cards, dropdowns, modals and other components that require background with shadow',
              ),
            ],
          },
        ),
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  dimmed: true,
  controls: [
    { prop: 'shadow', type: 'size', initialValue: 'xs', libraryValue: 'none' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'withBorder', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
