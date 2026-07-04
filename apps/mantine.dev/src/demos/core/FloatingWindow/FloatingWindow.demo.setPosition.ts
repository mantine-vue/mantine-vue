import { defineComponent, h, ref } from 'vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure, type SetFloatingWindowPosition } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure, type SetFloatingWindowPosition } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
const setPositionRef = ref<SetFloatingWindowPosition | null>(null)

function setPosition() {
  setPositionRef.value?.({ bottom: 40, right: 40 })
}
</script>

<template>
  <Group>
    <Button variant="default" @click="handlers.toggle">
      {{ visible ? 'Hide' : 'Show' }} floating window
    </Button>
    <Button variant="default" @click="setPosition">
      Set position to bottom right corner
    </Button>
  </Group>

  <FloatingWindow
    v-if="visible"
    :w="280"
    p="md"
    with-border
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 20 }"
    :style="{ cursor: 'move' }"
    :set-position-ref="setPositionRef"
  >
    <Group justify="space-between" mb="md">
      <Text>Set position demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">
      You can control floating window position programmatically with setPositionRef.
    </Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowSetPositionDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const setPositionRef = ref<SetFloatingWindowPosition | null>(null)

    function setPosition() {
      setPositionRef.value?.({ bottom: 40, right: 40 })
    }

    return () =>
      h('div', null, [
        h(Group, null, {
          default: () => [
            h(Button, { variant: 'default', onClick: () => handlers.toggle() }, () =>
              visible.value ? 'Hide floating window' : 'Show floating window',
            ),
            h(
              Button,
              { variant: 'default', onClick: setPosition },
              () => 'Set position to bottom right corner',
            ),
          ],
        }),
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
              setPositionRef,
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'Set position demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'You can control floating window position programmatically with setPositionRef.',
                ),
              ],
            },
          ),
      ])
  },
})

export const setPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
