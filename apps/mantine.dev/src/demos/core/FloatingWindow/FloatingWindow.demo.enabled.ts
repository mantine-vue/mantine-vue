import { defineComponent, h, ref } from 'vue'
import { Button, Chip, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Chip, CloseButton, FloatingWindow, Group, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [visible, handlers] = useDisclosure()
const enabled = ref(true)
</script>

<template>
  <Group>
    <Button variant="default" @click="handlers.toggle">
      {{ visible ? 'Hide' : 'Show' }} floating window
    </Button>
    <Chip :checked="enabled" @change="enabled = !enabled">
      Drag {{ enabled ? 'enabled' : 'disabled' }}
    </Chip>
  </Group>

  <FloatingWindow
    v-if="visible"
    :w="280"
    p="md"
    with-border
    exclude-drag-handle-selector="button"
    :initial-position="{ top: 300, left: 20 }"
    :style="{ cursor: 'move' }"
    :enabled="enabled"
  >
    <Group justify="space-between" mb="md">
      <Text>Enabled demo</Text>
      <CloseButton @click="handlers.close" />
    </Group>
    <Text fz="sm">This is a floating window. You can drag it around.</Text>
  </FloatingWindow>
</template>
`

const Demo = defineComponent({
  name: 'FloatingWindowEnabledDemo',
  setup() {
    const [visible, handlers] = useDisclosure()
    const enabled = ref(true)

    return () =>
      h('div', null, [
        h(Group, null, {
          default: () => [
            h(Button, { variant: 'default', onClick: () => handlers.toggle() }, () =>
              visible.value ? 'Hide floating window' : 'Show floating window',
            ),
            h(
              Chip,
              {
                checked: enabled.value,
                onChange: () => {
                  enabled.value = !enabled.value
                },
              },
              () => `Drag ${enabled.value ? 'enabled' : 'disabled'}`,
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
              enabled: enabled.value,
            },
            {
              default: () => [
                h(
                  Group,
                  { justify: 'space-between', mb: 'md' },
                  {
                    default: () => [
                      h(Text, null, () => 'Enabled demo'),
                      h(CloseButton, { onClick: () => handlers.close() }),
                    ],
                  },
                ),
                h(Text, { fz: 'sm' }, () => 'This is a floating window. You can drag it around.'),
              ],
            },
          ),
      ])
  },
})

export const enabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
