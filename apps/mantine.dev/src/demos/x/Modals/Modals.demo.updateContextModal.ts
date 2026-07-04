import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openUpdatingContextModal() {
  const modalId = modals.openContextModal({
    modal: 'asyncDemonstration',
    title: 'Processing...',
    closeOnEscape: false,
    closeOnClickOutside: false,
    closeButtonProps: { disabled: true },
    innerProps: {
      modalBody: 'You cannot close this modal until 2 seconds have passed.',
      loading: true,
    },
  })

  setTimeout(() => {
    modals.updateContextModal({
      modalId,
      title: 'Processing Complete!',
      closeOnEscape: true,
      closeOnClickOutside: true,
      closeButtonProps: { disabled: false },
      innerProps: {
        modalBody: 'You can now close the modal.',
        loading: false,
      },
    })
  }, 2000)
}
</script>

<template>
  <Button @click="openUpdatingContextModal">Open updating context modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsUpdateContextModalDemo',
  setup() {
    const openUpdatingContextModal = () => {
      const modalId = modals.openContextModal({
        modal: 'asyncDemonstration',
        title: 'Processing...',
        closeOnEscape: false,
        closeOnClickOutside: false,
        closeButtonProps: { disabled: true },
        innerProps: {
          modalBody: 'You cannot close this modal until 2 seconds have passed.',
          loading: true,
        },
      })

      setTimeout(() => {
        modals.updateContextModal({
          modalId,
          title: 'Processing Complete!',
          closeOnEscape: true,
          closeOnClickOutside: true,
          closeButtonProps: { disabled: false },
          innerProps: {
            modalBody: 'You can now close the modal.',
            loading: false,
          },
        })
      }, 2000)
    }

    return () =>
      h(Button, { onClick: openUpdatingContextModal }, () => 'Open updating context modal')
  },
})

export const updateContextModal: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
