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
  <Modal :opened="opened" :on-close="close" title="Authentication" centered>
    <!-- Modal content -->
  </Modal>

  <Button variant="default" @click="open">Open centered Modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalCenteredDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          { opened: opened.value, onClose: close, title: 'Authentication', centered: true },
          { default: () => h('p', null, 'Modal content goes here') },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open centered Modal'),
      ])
  },
})

export const centered: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
