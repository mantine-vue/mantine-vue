import { defineComponent, h } from 'vue'
import { Button, Modal, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Modal, Button, TextInput } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Modal :opened="opened" :on-close="close" title="Focus demo">
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
  name: 'ModalInitialFocusDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          { opened: opened.value, onClose: close, title: 'Focus demo' },
          {
            default: () => [
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

export const initialFocus: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
