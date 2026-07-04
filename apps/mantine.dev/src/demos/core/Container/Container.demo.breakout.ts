import { defineComponent, h } from 'vue'
import { Box, Container } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Container } from '@mantine-vue/core'
</script>

<template>
  <Container strategy="grid" :size="500">
    <Box bg="var(--mantine-color-indigo-light)" :h="50">
      Main content
    </Box>

    <Box data-breakout bg="var(--mantine-color-indigo-light)" mt="xs">
      <div>Breakout</div>

      <Box data-container bg="indigo" c="white" :h="50">
        <div>Container inside breakout</div>
      </Box>
    </Box>
  </Container>
</template>
`

const Demo = defineComponent({
  name: 'ContainerBreakoutDemo',
  setup: () => () =>
    h(
      Container,
      { strategy: 'grid', size: 500 },
      {
        default: () => [
          h(
            Box,
            { bg: 'var(--mantine-color-indigo-light)', h: 50 },
            { default: () => 'Main content' },
          ),
          h(
            Box,
            { 'data-breakout': true, bg: 'var(--mantine-color-indigo-light)', mt: 'xs' },
            {
              default: () => [
                h('div', null, 'Breakout'),
                h(
                  Box,
                  { 'data-container': true, bg: 'indigo', c: 'white', h: 50 },
                  {
                    default: () => h('div', null, 'Container inside breakout'),
                  },
                ),
              ],
            },
          ),
        ],
      },
    ),
})

export const breakout: MantineDemo = { type: 'code', component: Demo, code }
