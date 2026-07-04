import { defineComponent, h } from 'vue'
import { Button, Dialog, Group, Text, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Dialog, Group, Button, TextInput, Text } from '@mantine-vue/core'

const [opened, { toggle, close }] = useDisclosure(false)
</script>

<template>
  <Group justify="center">
    <Button @click="toggle">Toggle dialog</Button>
  </Group>

  <Dialog
    :opened="opened"
    with-close-button
    :on-close="close"
    size="lg"
    :position="{ bottom: 20, left: 20 }"
  >
    <Text size="sm" mb="xs" fw="500">
      Subscribe to email newsletter
    </Text>

    <Group align="flex-end">
      <TextInput placeholder="hello@gluesticker.com" style="flex: 1" />
      <Button @click="close">Subscribe</Button>
    </Group>
  </Dialog>
</template>
`

const Demo = defineComponent({
  name: 'DialogUsageDemo',
  setup() {
    const [opened, { toggle, close }] = useDisclosure(false)

    return () =>
      h('div', null, [
        h(Group, { justify: 'center' }, () =>
          h(Button, { onClick: toggle }, () => 'Toggle dialog'),
        ),
        h(
          Dialog,
          {
            opened: opened.value,
            withCloseButton: true,
            onClose: close,
            size: 'lg',
            position: { bottom: 20, left: 20 },
          },
          {
            default: () => [
              h(Text, { size: 'sm', mb: 'xs', fw: '500' }, () => 'Subscribe to email newsletter'),
              h(Group, { align: 'flex-end' }, () => [
                h(TextInput, { placeholder: 'hello@gluesticker.com', style: { flex: 1 } }),
                h(Button, { onClick: close }, () => 'Subscribe'),
              ]),
            ],
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
