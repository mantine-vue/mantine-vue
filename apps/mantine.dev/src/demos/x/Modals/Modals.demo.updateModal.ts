import { defineComponent, h } from 'vue'
import { Button, Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openUpdatingModal() {
  const modalId = modals.open({
    title: 'Initial Modal Title',
    children: h(Text, { size: 'sm' }, () => 'This text will update after 2 seconds.'),
  })

  setTimeout(() => {
    modals.updateModal({
      modalId,
      title: 'Updated Modal Title',
      children: h(Text, { size: 'sm' }, () => 'This is the updated content of the modal.'),
    })
  }, 2000)
}
</script>

<template>
  <Button @click="openUpdatingModal">Open updating modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsUpdateModalDemo',
  setup() {
    const openUpdatingModal = () => {
      const modalId = modals.open({
        title: 'Initial Modal Title',
        children: h(Text, { size: 'sm' }, () => 'This text will update after 2 seconds.'),
      })

      setTimeout(() => {
        modals.updateModal({
          modalId,
          title: 'Updated Modal Title',
          children: h(Text, { size: 'sm' }, () => 'This is the updated content of the modal.'),
        })
      }, 2000)
    }

    return () => h(Button, { onClick: openUpdatingModal }, () => 'Open updating modal')
  },
})

export const updateModal: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
