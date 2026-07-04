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

function openDeleteModal() {
  modals.openConfirmModal({
    title: 'Delete your profile',
    centered: true,
    children: h(
      Text,
      { size: 'sm' },
      () =>
        'Are you sure you want to delete your profile? This action is destructive and you will have to contact support to restore your data.',
    ),
    labels: { confirm: 'Delete account', cancel: 'No don\\'t delete it' },
    confirmProps: { color: 'red' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  })
}
</script>

<template>
  <Button @click="openDeleteModal" color="red">Delete account</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsConfirmCustomizeDemo',
  setup() {
    const openDeleteModal = () =>
      modals.openConfirmModal({
        title: 'Delete your profile',
        centered: true,
        children: h(
          Text,
          { size: 'sm' },
          () =>
            'Are you sure you want to delete your profile? This action is destructive and you will have to contact support to restore your data.',
        ),
        labels: { confirm: 'Delete account', cancel: "No don't delete it" },
        confirmProps: { color: 'red' },
        onCancel: () =>
          notifications.show({
            title: 'Canceled',
            message: 'Delete modal was canceled',
            color: 'gray',
          }),
        onConfirm: () =>
          notifications.show({
            title: 'Deleted',
            message: 'Delete modal was confirmed',
            color: 'red',
          }),
      })

    return () => h(Button, { onClick: openDeleteModal, color: 'red' }, () => 'Delete account')
  },
})

export const confirmCustomize: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
