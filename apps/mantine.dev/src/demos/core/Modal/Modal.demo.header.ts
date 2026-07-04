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
  <Modal :opened="opened" :on-close="close" :with-close-button="false">
    Modal without header, press escape or click on overlay to close
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalHeaderDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          { opened: opened.value, onClose: close, withCloseButton: false },
          {
            default: () => 'Modal without header, press escape or click on overlay to close',
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const header: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
