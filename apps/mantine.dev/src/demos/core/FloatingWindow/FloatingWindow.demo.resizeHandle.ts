import { defineComponent, h } from 'vue'
import { PhNotches } from '@phosphor-icons/vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const dimensions = {
  initialWidth: 260,
  maxWidth: 500,
  minWidth: 180,
  initialHeight: 260,
  maxHeight: 400,
  minHeight: 220,
}

const handleStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'nwse-resize',
}

const code = `
<script setup lang="ts">
import { PhNotches } from '@phosphor-icons/vue'
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
    with-border
    :constrain-offset="40"
    :dimensions="{
      initialWidth: 260,
      maxWidth: 500,
      minWidth: 180,
      initialHeight: 260,
      maxHeight: 400,
      minHeight: 220,
    }"
    drag-handle-selector=".drag-handle"
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 60 }"
    :style="{ overflow: 'hidden' }"
  >
    <Group
      justify="space-between"
      px="md"
      py="sm"
      class="drag-handle"
      :style="{ cursor: 'move' }"
    >
      <Text fw="500" fz="sm">Resize demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm" px="md" pb="sm">
      Drag the grip in the bottom-right corner to resize. Use Arrow keys when focused:
      Left/Right for width, Up/Down for height.
    </Text>
    <FloatingWindow.ResizeHandle
      aria-label="Resize floating window"
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'nwse-resize',
      }"
    >
      <PhNotches :size="14" aria-hidden="true" :style="{ opacity: 0.5 }" />
    </FloatingWindow.ResizeHandle>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowResizeHandleDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    return () =>
      h('div', null, [
        h(Button, { variant: 'default', onClick: handlers.toggle }, () =>
          visible.value ? 'Hide floating window' : 'Show floating window',
        ),
        visible.value
          ? h(
              FloatingWindow,
              {
                withBorder: true,
                constrainOffset: 40,
                dimensions,
                dragHandleSelector: '.drag-handle',
                excludeDragHandleSelector: 'button',
                initialPosition: { top: 300, left: 60 },
                style: { overflow: 'hidden' },
              },
              () => [
                h(
                  Group,
                  {
                    justify: 'space-between',
                    px: 'md',
                    py: 'sm',
                    class: 'drag-handle',
                    style: { cursor: 'move' },
                  },
                  () => [
                    h(Text, { fw: 500, fz: 'sm' }, () => 'Resize demo'),
                    h(CloseButton, { onClick: handlers.close }),
                  ],
                ),
                h(
                  Text,
                  { fz: 'sm', px: 'md', pb: 'sm' },
                  () =>
                    'Drag the grip in the bottom-right corner to resize. Use Arrow keys when focused: Left/Right for width, Up/Down for height.',
                ),
                h(
                  FloatingWindow.ResizeHandle,
                  { 'aria-label': 'Resize floating window', style: handleStyle },
                  () => h(PhNotches, { size: 14, 'aria-hidden': 'true', style: { opacity: 0.5 } }),
                ),
              ],
            )
          : null,
      ])
  },
})

export const resizeHandle: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
