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
    :initial-position="{ top: 300, left: 20 }"
    :style="{ cursor: 'move' }"
    :constrain-to-viewport="false"
  >
    <Group justify="space-between" mb="md">
      <Text>No constrain demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">
      The floating window is not constrained by the viewport, it can move out of bounds.
    </Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowConstrainToViewportDemo',
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
              constrainToViewport: false,
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'No constrain demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'The floating window is not constrained by the viewport, it can move out of bounds.',
                ),
              ],
            },
          ),
      ])
  },
})

export const constrainToViewport: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
