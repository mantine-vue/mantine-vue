import { defineComponent, h, ref } from 'vue'
import { Box, Button, Code, Group, Portal, Stack, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Box, Button, Code, Group, Portal, Stack, Text } from '@mantine-vue/core'
import { useDisclosure, useHeadroom } from '@mantine-vue/hooks'

const [showHeader, handlers] = useDisclosure(false)
const log = ref<string[]>([])

const addLog = (msg: string) => {
  log.value = [\`\${new Date().toLocaleTimeString()} — \${msg}\`, ...log.value].slice(0, 10)
}

const { pinned } = useHeadroom({
  fixedAt: 80,
  onPin: () => addLog('onPin'),
  onRelease: () => addLog('onRelease'),
  onFix: () => addLog('onFix'),
})
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
        transform: \`translate3d(0, \${pinned ? 0 : '-110px'}, 0)\`,
        transition: 'transform 400ms ease',
        backgroundColor: pinned ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
      }"
    >
      <Group justify="center" h="100%">
        <Text c="white" :fw="500">{{ pinned ? 'Pinned' : 'Released' }}</Text>
      </Group>
    </Box>
  </Portal>

  <Stack>
    <Button variant="default" @click="handlers.toggle">
      {{ showHeader ? 'Hide' : 'Show' }} header
    </Button>
    <Code block>
      {{ log.length === 0 ? 'Scroll to see callback events' : log.join('\\n') }}
    </Code>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'UseHeadroomCallbacksDemo',
  setup() {
    const [showHeader, handlers] = useDisclosure(false)
    const log = ref<string[]>([])

    const addLog = (msg: string) => {
      log.value = [`${new Date().toLocaleTimeString()} — ${msg}`, ...log.value].slice(0, 10)
    }

    const { pinned } = useHeadroom({
      fixedAt: 80,
      onPin: () => addLog('onPin'),
      onRelease: () => addLog('onRelease'),
      onFix: () => addLog('onFix'),
    })

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
                  transform: `translate3d(0, ${pinned.value ? 0 : '-110px'}, 0)`,
                  transition: 'transform 400ms ease',
                  backgroundColor: pinned.value
                    ? 'var(--mantine-color-teal-6)'
                    : 'var(--mantine-color-red-6)',
                },
              },
              () =>
                h(Group, { justify: 'center', h: '100%' }, () =>
                  h(Text, { c: 'white', fw: 500 }, () => (pinned.value ? 'Pinned' : 'Released')),
                ),
            ),
          )
        : null,
      h(Stack, null, () => [
        h(
          Button,
          { variant: 'default', onClick: handlers.toggle },
          () => `${showHeader.value ? 'Hide' : 'Show'} header`,
        ),
        h(Code, { block: true }, () =>
          log.value.length === 0 ? 'Scroll to see callback events' : log.value.join('\n'),
        ),
      ]),
    ]
  },
})

export const callbacks: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
