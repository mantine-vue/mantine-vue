import { defineComponent, h } from 'vue'
import { Button, FocusTrap, Modal, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Modal, Button, TextInput, FocusTrap } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Modal :opened="opened" :on-close="close" title="Focus demo">
    <FocusTrap.InitialFocus />
    <TextInput label="First input" placeholder="First input" />
    <TextInput
      data-autofocus
      label="Input with initial focus"
      placeholder="It has data-autofocus attribute"
      mt="md"
    />
  </Modal>

  <Button variant="default" @click="open">Open modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalInitialFocusTrapDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          { opened: opened.value, onClose: close, title: 'Focus demo' },
          {
            default: () => [
              h(FocusTrap.InitialFocus),
              h(TextInput, { label: 'First input', placeholder: 'First input' }),
              h(TextInput, {
                'data-autofocus': true,
                label: 'Input with initial focus',
                placeholder: 'It has data-autofocus attribute',
                mt: 'md',
              }),
            ],
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open modal'),
      ])
  },
})

export const initialFocusTrap: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
