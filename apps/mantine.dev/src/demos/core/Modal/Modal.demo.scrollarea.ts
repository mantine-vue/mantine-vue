import { defineComponent, h } from 'vue'
import { Button, Modal, ScrollAreaAutosize } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Modal, Button, ScrollAreaAutosize } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Modal
    :opened="opened"
    :on-close="close"
    title="Header is sticky"
    :scroll-area-component="ScrollAreaAutosize"
  >
    <p v-for="i in 100" :key="i">Modal with scroll</p>
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalScrollAreaDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    const content = Array.from({ length: 100 }, (_, i) => h('p', { key: i }, 'Modal with scroll'))
    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: opened.value,
            onClose: close,
            title: 'Header is sticky',
            scrollAreaComponent: ScrollAreaAutosize,
          },
          { default: () => content },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const scrollarea: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
