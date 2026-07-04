import { defineComponent, h } from 'vue'
import { Badge, Button, Group, Modal, Text } from '@mantine-vue/core'
import { useCounter, useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure, useCounter } from '@mantine-vue/hooks'
import { Modal, Button, Group, Text, Badge } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
const [count, { increment, decrement }] = useCounter(3, { min: 0 })
</script>

<template>
  <Modal :opened="opened" :on-close="close" size="auto" title="Modal size auto">
    <Text>Modal with size auto will fits its content</Text>

    <Group wrap="nowrap" mt="md">
      <Badge v-for="index in count" :key="index">Badge {{ index - 1 }}</Badge>
    </Group>

    <Group mt="xl">
      <Button @click="increment">Add badge</Button>
      <Button @click="decrement">Remove badge</Button>
    </Group>
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalSizeAutoDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    const [count, { increment, decrement }] = useCounter(3, { min: 0 })

    return () =>
      h('div', null, [
        h(
          Modal,
          { opened: opened.value, onClose: close, size: 'auto', title: 'Modal size auto' },
          {
            default: () => [
              h(Text, null, () => 'Modal with size auto will fits its content'),
              h(
                Group,
                { wrap: 'nowrap', mt: 'md' },
                {
                  default: () =>
                    Array.from({ length: count.value }, (_, index) =>
                      h(Badge, { key: index }, () => `Badge ${index}`),
                    ),
                },
              ),
              h(
                Group,
                { mt: 'xl' },
                {
                  default: () => [
                    h(Button, { onClick: increment }, () => 'Add badge'),
                    h(Button, { onClick: decrement }, () => 'Remove badge'),
                  ],
                },
              ),
            ],
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const sizeAuto: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
