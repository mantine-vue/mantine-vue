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
  <Modal :opened="opened" :on-close="close" title="Authentication" y-offset="1vh" :x-offset="0">
    <!-- Modal content -->
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalOffsetDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: opened.value,
            onClose: close,
            title: 'Authentication',
            yOffset: '1vh',
            xOffset: 0,
          },
          { default: () => h('p', null, 'Modal content goes here') },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const offset: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
