import { defineComponent, h } from 'vue'
import { Button, Modal } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Modal, Button } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Modal.Root :opened="opened" :on-close="close">
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Modal title</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>Modal content</Modal.Body>
    </Modal.Content>
  </Modal.Root>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalCompositionDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal.Root,
          { opened: opened.value, onClose: close },
          {
            default: () => [
              h(Modal.Overlay),
              h(Modal.Content, null, {
                default: () => [
                  h(Modal.Header, null, {
                    default: () => [
                      h(Modal.Title, null, () => 'Modal title'),
                      h(Modal.CloseButton),
                    ],
                  }),
                  h(Modal.Body, null, () => 'Modal content'),
                ],
              }),
            ],
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const composition: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
