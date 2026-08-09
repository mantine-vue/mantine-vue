import { defineComponent, h, ref } from 'vue'
import { PhNotches } from '@phosphor-icons/vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { FloatingWindowSize } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const dimensions = {
  initialWidth: 260,
  maxWidth: 500,
  minWidth: 180,
  initialHeight: 200,
  maxHeight: 400,
  minHeight: 160,
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
import { ref } from 'vue'
import { PhNotches } from '@phosphor-icons/vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { FloatingWindowSize } from '@mantine-vue/core'

const [visible, handlers] = useDisclosure()
const size = ref({ width: 260, height: 200 })
const resizing = ref(false)
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
      initialHeight: 200,
      maxHeight: 400,
      minHeight: 160,
    }"
    drag-handle-selector=".drag-handle"
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 60 }"
    :style="{ overflow: 'hidden' }"
    @size-change="(value: FloatingWindowSize) => (size = value)"
    @resize-start="() => (resizing = true)"
    @resize-end="() => (resizing = false)"
  >
    <Group justify="space-between" px="md" py="sm" class="drag-handle">
      <Text fw="500" fz="sm">Resize callbacks</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm" px="md">{{ Math.round(size.width) }} × {{ Math.round(size.height) }}</Text>
    <Text fz="sm" px="md" c="dimmed">
      {{ resizing ? 'Resizing…' : 'Drag the grip to resize' }}
    </Text>
    <FloatingWindow.ResizeHandle aria-label="Resize floating window" :style="handleStyle">
      <PhNotches :size="14" aria-hidden="true" :style="{ opacity: 0.5 }" />
    </FloatingWindow.ResizeHandle>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowResizeCallbacksDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const size = ref<FloatingWindowSize>({ width: 260, height: 200 })
    const resizing = ref(false)

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
                onSizeChange: (value: FloatingWindowSize) => {
                  size.value = value
                },
                onResizeStart: () => {
                  resizing.value = true
                },
                onResizeEnd: () => {
                  resizing.value = false
                },
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
                    h(Text, { fw: 500, fz: 'sm' }, () => 'Resize callbacks'),
                    h(CloseButton, { onClick: handlers.close }),
                  ],
                ),
                h(
                  Text,
                  { fz: 'sm', px: 'md' },
                  () => `${Math.round(size.value.width)} × ${Math.round(size.value.height)}`,
                ),
                h(Text, { fz: 'sm', px: 'md', c: 'dimmed' }, () =>
                  resizing.value ? 'Resizing…' : 'Drag the grip to resize',
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

export const resizeCallbacks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
