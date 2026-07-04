import type { MantineDemo } from '@/types'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { defineComponent, h } from 'vue'

const code = `
<script setup lang="ts">
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
</script>

<template>
  <Button variant="default" @click="handlers.toggle">
    {{ visible ? 'Hide' : 'Show' }} floating window
  </Button>

  <FloatingWindow
    v-if="visible"
    :w="280"
    p="md"
    with-border
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 20 }"
    :style="{ cursor: 'move' }"
  >
    <Group justify="space-between" mb="md">
      <Text>Usage demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">This is a floating window. You can drag it around.</Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowUsageDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { variant: 'default', onClick: () => handlers.toggle() }, () =>
          visible.value ? 'Hide floating window' : 'Show floating window',
        ),
        visible.value &&
          h(
            FloatingWindow,
            {
              w: 280,
              p: 'md',
              withBorder: true,
              excludeDragHandleSelector: 'button',
              initialPosition: { top: 300, left: 20 },
              style: { cursor: 'move' },
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'Usage demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(Text, { fz: 'sm' }, () => 'This is a floating window. You can drag it around.'),
              ],
            },
          ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
