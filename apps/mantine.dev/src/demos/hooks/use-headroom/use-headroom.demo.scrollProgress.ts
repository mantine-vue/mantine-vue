import { defineComponent, h } from 'vue'
import { Box, Button, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Button, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'

const [showHeader, handlers] = useDisclosure(false)
const { scrollProgress } = useHeadroom({ fixedAt: 120, scrollDistance: 60 })
</script>

<template>
  <Portal v-if="showHeader">
    <Box
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 1000000,
        transform: \`translateY(\${(scrollProgress - 1) * 100}%)\`,
        backgroundColor: 'var(--mantine-color-violet-6)',
      }"
    >
      <Group justify="center" h="100%">
        <Text c="white" :fw="500">
          Scroll-linked — {{ Math.round(scrollProgress * 100) }}% visible
        </Text>
      </Group>
    </Box>
  </Portal>

  <Button variant="default" @click="handlers.toggle">
    {{ showHeader ? 'Hide' : 'Show' }} header
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'UseHeadroomScrollProgressDemo',
  setup() {
    const [showHeader, handlers] = useDisclosure(false)
    const { scrollProgress } = useHeadroom({ fixedAt: 120, scrollDistance: 60 })

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
                  height: '60px',
                  zIndex: 1000000,
                  transform: `translateY(${(scrollProgress.value - 1) * 100}%)`,
                  backgroundColor: 'var(--mantine-color-violet-6)',
                },
              },
              () =>
                h(Group, { justify: 'center', h: '100%' }, () =>
                  h(
                    Text,
                    { c: 'white', fw: 500 },
                    () => `Scroll-linked — ${Math.round(scrollProgress.value * 100)}% visible`,
                  ),
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

export const scrollProgress: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
