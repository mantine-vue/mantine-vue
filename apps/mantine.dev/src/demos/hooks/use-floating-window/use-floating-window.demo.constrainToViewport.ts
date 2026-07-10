import { defineComponent, h } from 'vue'
import { Button, CloseButton, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, CloseButton, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
const floatingWindow = useFloatingWindow({
  constrainToViewport: false,
  excludeDragHandleSelector: 'button',
  initialPosition: { top: 300, left: 20 },
})
</script>

<template>
  <Button @click="handlers.toggle" variant="default">
    {{ visible ? 'Hide' : 'Show' }} floating window
  </Button>

  <Portal v-if="visible">
    <!-- Bind the hook's ref to a plain native element, not a Mantine
         Vue component -- components don't forward refs to their root DOM node. -->
    <div
      :ref="floatingWindow.ref"
      :style="{
        width: '280px',
        padding: 'var(--mantine-spacing-md)',
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-default)',
        backgroundColor: 'var(--mantine-color-body)',
        boxShadow: floatingWindow.isDragging.value ? 'var(--mantine-shadow-md)' : undefined,
        position: 'fixed',
        cursor: 'move',
        transition: 'box-shadow 70ms ease',
        zIndex: 400,
      }"
    >
      <Group justify="space-between" mb="md">
        <Text>No constrain demo</Text>
        <CloseButton @click="handlers.close" />
      </Group>
      <Text fz="sm">
        The floating window is not constrained by the viewport, it can move out of bounds.
      </Text>
    </div>
  </Portal>
</template>
`

const Demo = defineComponent({
  name: 'UseFloatingWindowConstrainToViewportDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const floatingWindow = useFloatingWindow<HTMLDivElement>({
      constrainToViewport: false,
      excludeDragHandleSelector: 'button',
      initialPosition: { top: 300, left: 20 },
    })

    return () =>
      h('div', [
        h(
          Button,
          { onClick: () => handlers.toggle(), variant: 'default' },
          { default: () => `${visible.value ? 'Hide' : 'Show'} floating window` },
        ),
        visible.value &&
          h(Portal, () => [
            h(
              'div',
              {
                ref: floatingWindow.ref,
                style: {
                  width: '280px',
                  padding: 'var(--mantine-spacing-md)',
                  border: '1px solid var(--mantine-color-default-border)',
                  borderRadius: 'var(--mantine-radius-default)',
                  backgroundColor: 'var(--mantine-color-body)',
                  boxShadow: floatingWindow.isDragging.value
                    ? 'var(--mantine-shadow-md)'
                    : undefined,
                  position: 'fixed',
                  cursor: 'move',
                  transition: 'box-shadow 70ms ease',
                  zIndex: 400,
                },
              },
              [
                h(Group, { justify: 'space-between', mb: 'md' }, () => [
                  h(Text, () => 'No constrain demo'),
                  h(CloseButton, { onClick: () => handlers.close() }),
                ]),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'The floating window is not constrained by the viewport, it can move out of bounds.',
                ),
              ],
            ),
          ]),
      ])
  },
})

export const constrainToViewport: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
