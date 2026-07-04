import { defineComponent, h } from 'vue'
import { Button, Modal, Text } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Modal, Button } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Modal
    :opened="opened"
    :on-close="close"
    title="This is a fullscreen modal"
    full-screen
    :radius="0"
    :transition-props="{ transition: 'fade', duration: 200 }"
  >
    <!-- Modal content -->
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalFullScreenDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: opened.value,
            onClose: close,
            title: 'This is a fullscreen modal',
            fullScreen: true,
            radius: 0,
            transitionProps: { transition: 'fade', duration: 200 },
          },
          {
            default: () =>
              h(
                Text,
                { mb: 'xl' },
                () =>
                  'It takes the entire screen and does not have overlay and border-radius, you can use it on small screens to save up some space. It also has fade transition by default, but you can change that with the transition prop.',
              ),
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const fullScreen: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
