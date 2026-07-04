import { defineComponent, h } from 'vue'
import { Button, Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openModal() {
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: h(
      Text,
      { size: 'sm' },
      () =>
        'This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.',
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  })
}
</script>

<template>
  <Button @click="openModal">Open confirm modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsConfirmDemo',
  setup() {
    const openModal = () =>
      modals.openConfirmModal({
        modalId: 'test-id',
        title: 'Please confirm your action',
        children: h(
          Text,
          { size: 'sm' },
          () =>
            'This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.',
        ),
        onCancel: () =>
          notifications.show({
            title: 'Canceled',
            message: 'Confirm modal was canceled',
            color: 'gray',
          }),
        onConfirm: () =>
          notifications.show({
            title: 'Confirmed',
            message: 'Confirm modal was confirmed',
            color: 'teal',
          }),
      })

    return () => h(Button, { onClick: openModal }, () => 'Open confirm modal')
  },
})

export const confirm: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
