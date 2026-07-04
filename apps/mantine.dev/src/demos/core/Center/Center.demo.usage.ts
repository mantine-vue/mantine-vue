import { defineComponent, h } from 'vue'
import { Box, Center } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Center } from '@mantine-vue/core'
</script>

<template>
  <Center maw="400" :h="100" bg="var(--mantine-color-gray-light)">
    <Box bg="var(--mantine-color-blue-light)">All elements inside Center are centered</Box>
  </Center>
</template>
`

const Demo = defineComponent({
  name: 'CenterUsageDemo',
  setup() {
    return () =>
      h(
        Center,
        { maw: 400, h: 100, bg: 'var(--mantine-color-gray-light)' },
        {
          default: () =>
            h(
              Box,
              { bg: 'var(--mantine-color-blue-light)' },
              { default: () => 'All elements inside Center are centered' },
            ),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
