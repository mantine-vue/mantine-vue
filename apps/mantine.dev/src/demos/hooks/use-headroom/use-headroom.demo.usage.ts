import { defineComponent, h } from 'vue'
import { Box, Button, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Button, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'

const [showHeader, handlers] = useDisclosure(false)
const { pinned } = useHeadroom({ fixedAt: 120 })
</script>

<template>
  <Portal v-if="showHeader">
    <Box
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: 'var(--mantine-spacing-xs)',
        height: '60px',
        zIndex: 1000000,
        transform: \`translate3d(0, \${pinned ? 0 : '-110px'}, 0)\`,
        transition: 'transform 400ms ease',
        backgroundColor: 'var(--mantine-color-body)',
      }"
    >
      <Group justify="center" h="100%">
        <Text>Pinned header – {{ pinned ? 'visible' : 'hidden' }}</Text>
      </Group>
    </Box>
  </Portal>

  <Button variant="default" @click="handlers.toggle">
    {{ showHeader ? 'Hide' : 'Show' }} header
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'UseHeadroomUsageDemo',
  setup() {
    const [showHeader, handlers] = useDisclosure(false)
    const { pinned } = useHeadroom({ fixedAt: 120 })

    return () => [
      showHeader.value
        ? h(Portal, null, () =>
            h(
              Box,
              {
                style: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: 'var(--mantine-spacing-xs)',
                  height: '60px',
                  zIndex: 1000000,
                  transform: `translate3d(0, ${pinned.value ? 0 : '-110px'}, 0)`,
                  transition: 'transform 400ms ease',
                  backgroundColor: 'var(--mantine-color-body)',
                },
              },
              () =>
                h(Group, { justify: 'center', h: '100%' }, () =>
                  h(Text, null, () => `Pinned header – ${pinned.value ? 'visible' : 'hidden'}`),
                ),
            ),
          )
        : null,
      h(
        Button,
        { variant: 'default', onClick: handlers.toggle },
        () => `${showHeader.value ? 'Hide' : 'Show'} header`,
      ),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
