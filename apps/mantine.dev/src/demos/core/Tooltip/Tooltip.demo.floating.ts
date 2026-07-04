import { defineComponent, h } from 'vue'
import { Box, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip.Floating label="Floating tooltip">
    <Box p="xl" bg="var(--mantine-color-blue-light)" :style="{ cursor: 'default' }">
      Hover over the box to see tooltip
    </Box>
  </Tooltip.Floating>
</template>
`

const Demo = defineComponent({
  name: 'TooltipFloatingDemo',
  setup() {
    return () =>
      h(
        Tooltip.Floating,
        { label: 'Floating tooltip' },
        {
          default: () =>
            h(
              Box,
              { p: 'xl', bg: 'var(--mantine-color-blue-light)', style: { cursor: 'default' } },
              () => 'Hover over the box to see tooltip',
            ),
        },
      )
  },
})

export const floating: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
