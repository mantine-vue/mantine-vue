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
    with-border
    drag-handle-selector=".drag-handle"
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 20 }"
  >
    <Group
      justify="space-between"
      px="md"
      py="sm"
      class="drag-handle"
      :style="{ cursor: 'move' }"
    >
      <Text>Drag handle demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm" px="md" pb="sm">
      Drag floating window around with drag handle element.
    </Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowDragHandleSelectorDemo',
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
              withBorder: true,
              dragHandleSelector: '.drag-handle',
              excludeDragHandleSelector: 'button',
              initialPosition: { top: 300, left: 20 },
            },
            {
              default: () => [
                h(
                  Group,
                  {
                    justify: 'space-between',
                    px: 'md',
                    py: 'sm',
                    class: 'drag-handle',
                    style: { cursor: 'move' },
                  },
                  {
                    default: () => [
                      h(Text, null, () => 'Drag handle demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(
                  Text,
                  { fz: 'sm', px: 'md', pb: 'sm' },
                  () => 'Drag floating window around with drag handle element.',
                ),
              ],
            },
          ),
      ])
  },
})

export const dragHandleSelector: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
