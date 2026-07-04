import { defineComponent, h, ref } from 'vue'
import { Button, Group, Modal } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Modal } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [firstOpened, firstHandlers] = useDisclosure(false)
const [secondOpened, secondHandlers] = useDisclosure(false)
const modalData = ref({ title: '', message: '' })
</script>

<template>
  <Modal
    :opened="firstOpened"
    :on-close="() => { firstHandlers.close(); modalData = { title: '', message: '' } }"
    :transition-props="{ duration: 300, exitDuration: 1000, transition: 'fade-down' }"
    :title="modalData.title"
  >
    {{ modalData.message }}
  </Modal>

  <Modal
    :opened="secondOpened"
    :on-close="secondHandlers.close"
    :transition-props="{ duration: 300, exitDuration: 1000, transition: 'fade-down' }"
    :on-exit-transition-end="() => (modalData = { title: '', message: '' })"
    :title="modalData.title"
  >
    {{ modalData.message }}
  </Modal>

  <Group>
    <Button
      variant="default"
      @click="() => { firstHandlers.open(); modalData = { title: 'Edit your profile', message: 'Imagine a form here' } }"
    >
      Clear data in onClose
    </Button>

    <Button
      variant="default"
      @click="() => { secondHandlers.open(); modalData = { title: 'Edit your profile', message: 'Imagine a form here' } }"
    >
      Clear data in onExitTransitionEnd
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ModalTransitionEndDemo',
  setup() {
    const [firstOpened, firstHandlers] = useDisclosure(false)
    const [secondOpened, secondHandlers] = useDisclosure(false)
    const modalData = ref({ title: '', message: '' })

    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: firstOpened.value,
            onClose: () => {
              firstHandlers.close()
              modalData.value = { title: '', message: '' }
            },
            transitionProps: { duration: 300, exitDuration: 1000, transition: 'fade-down' },
            title: modalData.value.title,
          },
          { default: () => modalData.value.message },
        ),
        h(
          Modal,
          {
            opened: secondOpened.value,
            onClose: secondHandlers.close,
            transitionProps: { duration: 300, exitDuration: 1000, transition: 'fade-down' },
            onExitTransitionEnd: () => {
              modalData.value = { title: '', message: '' }
            },
            title: modalData.value.title,
          },
          { default: () => modalData.value.message },
        ),
        h(Group, null, {
          default: () => [
            h(
              Button,
              {
                variant: 'default',
                onClick: () => {
                  firstHandlers.open()
                  modalData.value = { title: 'Edit your profile', message: 'Imagine a form here' }
                },
              },
              () => 'Clear data in onClose',
            ),
            h(
              Button,
              {
                variant: 'default',
                onClick: () => {
                  secondHandlers.open()
                  modalData.value = { title: 'Edit your profile', message: 'Imagine a form here' }
                },
              },
              () => 'Clear data in onExitTransitionEnd',
            ),
          ],
        }),
      ])
  },
})

export const transitionEnd: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
  defaultExpanded: false,
}
