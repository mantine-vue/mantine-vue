import { defineComponent, h, ref } from 'vue'
import {
  Button,
  CloseButton,
  FloatingWindow,
  Group,
  SegmentedControl,
  Text,
} from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, CloseButton, FloatingWindow, Group, SegmentedControl, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
const axis = ref<'x' | 'y'>('y')
</script>

<template>
  <Group>
    <Button variant="default" @click="handlers.toggle">
      {{ visible ? 'Hide' : 'Show' }} floating window
    </Button>
    <SegmentedControl :data="['x', 'y']" :value="axis" @change="(val) => axis = val as 'x' | 'y'" />
  </Group>

  <FloatingWindow
    v-if="visible"
    :w="280"
    p="md"
    with-border
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 200, left: 40 }"
    :style="{ cursor: 'move' }"
    :axis="axis"
  >
    <Group justify="space-between" mb="md">
      <Text>Axis demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">
      When you set axis prop, the floating window can be dragged only horizontally or vertically.
    </Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowAxisDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const axis = ref<'x' | 'y'>('y')

    return () =>
      h('div', null, [
        h(Group, null, {
          default: () => [
            h(Button, { variant: 'default', onClick: () => handlers.toggle() }, () =>
              visible.value ? 'Hide floating window' : 'Show floating window',
            ),
            h(SegmentedControl, {
              data: ['x', 'y'],
              value: axis.value,
              onChange: (val: string) => {
                axis.value = val as 'x' | 'y'
              },
            }),
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
              initialPosition: { top: 200, left: 40 },
              style: { cursor: 'move' },
              axis: axis.value,
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'Axis demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(
                  Text,
                  { fz: 'sm' },
                  () =>
                    'When you set axis prop, the floating window can be dragged only horizontally or vertically.',
                ),
              ],
            },
          ),
      ])
  },
})

export const axis: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
