import { defineComponent, h } from 'vue'
import { Button, Modal } from '@mantine-vue/core'
import { useDisclosure, useMediaQuery } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure, useMediaQuery } from '@mantine-vue/hooks'
import { Modal, Button } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
const isMobile = useMediaQuery('(max-width: 50em)')
</script>

<template>
  <Modal
    :opened="opened"
    :on-close="close"
    title="This is a fullscreen modal"
    :full-screen="isMobile"
    :transition-props="{ transition: 'fade', duration: 200 }"
  >
    The Modal will be full screen only on mobile
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalFullScreenMobileDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    const isMobile = useMediaQuery('(max-width: 50em)')
    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: opened.value,
            onClose: close,
            title: 'This is a fullscreen modal',
            fullScreen: isMobile.value,
            transitionProps: { transition: 'fade', duration: 200 },
          },
          { default: () => 'The Modal will be full screen only on mobile' },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const fullScreenMobile: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
