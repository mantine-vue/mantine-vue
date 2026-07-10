import { defineComponent, h, reactive } from 'vue'
import { Button, Chip, CloseButton, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { reactive } from 'vue'
import { Button, Chip, CloseButton, Group, Portal, Text } from '@mantine-vue/core'
import { useDisclosure, useFloatingWindow } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
const options = reactive({
  enabled: true,
  constrainToViewport: true,
  constrainOffset: 20,
  excludeDragHandleSelector: 'button',
  initialPosition: { top: 300, left: 20 },
})
const floatingWindow = useFloatingWindow(options)
</script>

<template>
  <Group>
    <Button variant="default" @click="handlers.toggle">
      {{ visible ? 'Hide' : 'Show' }} floating window
    </Button>
    <Chip :checked="options.enabled" @click="options.enabled = !options.enabled">
      Drag {{ options.enabled ? 'enabled' : 'disabled' }}
    </Chip>
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
        <Text>Enabled demo</Text>
        <CloseButton @click="handlers.close" />
      </Group>
      <Text fz="sm">This is a floating window. You can drag it around.</Text>
    </div>
  </Portal>
</template>
`

const Demo = defineComponent({
  name: 'UseFloatingWindowEnabledDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const options = reactive({
      enabled: true,
      constrainToViewport: true,
      constrainOffset: 20,
      excludeDragHandleSelector: 'button',
      initialPosition: { top: 300, left: 20 },
    })
    const floatingWindow = useFloatingWindow<HTMLDivElement>(options as any)

    return () =>
      h('div', [
        h(Group, () => [
          h(
            Button,
            { variant: 'default', onClick: () => handlers.toggle() },
            { default: () => `${visible.value ? 'Hide' : 'Show'} floating window` },
          ),
          h(
            Chip,
            {
              checked: options.enabled,
              onClick: () => {
                options.enabled = !options.enabled
              },
            },
            { default: () => `Drag ${options.enabled ? 'enabled' : 'disabled'}` },
          ),
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
                  h(Text, () => 'Enabled demo'),
                  h(CloseButton, { onClick: () => handlers.close() }),
                ]),
                h(Text, { fz: 'sm' }, () => 'This is a floating window. You can drag it around.'),
              ],
            ),
          ]),
      ])
  },
})

export const enabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
