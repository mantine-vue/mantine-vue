import { defineComponent, h } from 'vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

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
    :initial-position="{ top: 300, left: 30 }"
    :style="{ cursor: 'move' }"
    constrain-to-viewport
    :constrain-offset="30"
  >
    <Group justify="space-between" mb="md">
      <Text>Constrain offset demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">
      This floating window has 30px offset, it cannot move closer that 30px to the edge of the viewport.
    </Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowConstrainOffsetDemo',
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
              initialPosition: { top: 300, left: 30 },
              style: { cursor: 'move' },
              constrainToViewport: true,
              constrainOffset: 30,
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'Constrain offset demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'This floating window has 30px offset, it cannot move closer that 30px to the edge of the viewport.',
                ),
              ],
            },
          ),
      ])
  },
})

export const constrainOffset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
