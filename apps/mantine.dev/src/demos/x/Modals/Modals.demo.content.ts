import { defineComponent, h } from 'vue'
import { Button, TextInput } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Button, TextInput } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openModal() {
  modals.open({
    title: 'Subscribe to newsletter',
    children: [
      h(TextInput, { label: 'Your email', placeholder: 'Your email', 'data-autofocus': true }),
      h(Button, { fullWidth: true, mt: 'md', onClick: () => modals.closeAll() }, () => 'Submit'),
    ],
  })
}
</script>

<template>
  <Button @click="openModal">Open content modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsContentDemo',
  setup() {
    const openModal = () =>
      modals.open({
        title: 'Subscribe to newsletter',
        children: [
          h(TextInput, {
            label: 'Your email',
            placeholder: 'Your email',
            'data-autofocus': true,
          }),
          h(
            Button,
            { fullWidth: true, mt: 'md', onClick: () => modals.closeAll() },
            () => 'Submit',
          ),
        ],
      })

    return () => h(Button, { onClick: openModal }, () => 'Open content modal')
  },
})

export const content: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
