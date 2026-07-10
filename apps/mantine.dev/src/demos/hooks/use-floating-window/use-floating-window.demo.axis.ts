import { defineComponent, h, reactive } from 'vue'
import { Button, CloseButton, Group, Portal, SegmentedControl, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { reactive } from 'vue'
import { Button, CloseButton, Group, Portal, SegmentedControl, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()

const options = reactive({
  axis: 'y' as 'x' | 'y',
  constrainToViewport: true,
  constrainOffset: 20,
  excludeDragHandleSelector: 'button',
  initialPosition: { top: 300, left: 20 },
})
const floatingWindow = useFloatingWindow(options)
</script>

<template>
  <Group>
    <Button @click="handlers.toggle" variant="default">
      {{ visible ? 'Hide' : 'Show' }} floating window
    </Button>
    <SegmentedControl :data="['x', 'y']" v-model="options.axis" />
  </Group>

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
        <Text>Axis demo</Text>
        <CloseButton @click="handlers.close" />
      </Group>
      <Text fz="sm">
        When you set axis option, the floating window can be dragged only horizontally or
        vertically.
      </Text>
    </div>
  </Portal>
</template>
`

const Demo = defineComponent({
  name: 'UseFloatingWindowAxisDemo',
  setup() {
    const [visible, handlers] = useDisclosure()

    const options = reactive({
      axis: 'y' as 'x' | 'y',
      constrainToViewport: true,
      constrainOffset: 20,
      excludeDragHandleSelector: 'button',
      initialPosition: { top: 300, left: 20 },
    })
    const floatingWindow = useFloatingWindow<HTMLDivElement>(options)

    return () =>
      h('div', [
        h(Group, () => [
          h(
            Button,
            { onClick: () => handlers.toggle(), variant: 'default' },
            { default: () => `${visible.value ? 'Hide' : 'Show'} floating window` },
          ),
          h(SegmentedControl, {
            data: ['x', 'y'],
            modelValue: options.axis,
            'onUpdate:modelValue': (val: string) => (options.axis = val as 'x' | 'y'),
          }),
        ]),
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
                  h(Text, () => 'Axis demo'),
                  h(CloseButton, { onClick: () => handlers.close() }),
                ]),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'When you set axis option, the floating window can be dragged only horizontally or vertically.',
                ),
              ],
            ),
          ]),
      ])
  },
})

export const axis: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
