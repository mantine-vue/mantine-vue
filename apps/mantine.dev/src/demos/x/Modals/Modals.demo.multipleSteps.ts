import { defineComponent, h } from 'vue'
import { Button, Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Text } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openMultipleSteps() {
  modals.openConfirmModal({
    title: 'Please confirm your action',
    closeOnConfirm: false,
    labels: { confirm: 'Next modal', cancel: 'Close modal' },
    children: h(
      Text,
      { size: 'sm' },
      () =>
        'This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.',
    ),
    onConfirm: () =>
      modals.openConfirmModal({
        title: 'This is modal at second layer',
        labels: { confirm: 'Close modal', cancel: 'Back' },
        closeOnConfirm: false,
        children: h(Text, { size: 'sm' }, () => 'When this modal is closed modals state will revert to first modal'),
        onConfirm: modals.closeAll,
      }),
  })
}
</script>

<template>
  <Button @click="openMultipleSteps">Open multiple steps modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsMultipleStepsDemo',
  setup() {
    const openMultipleSteps = () =>
      modals.openConfirmModal({
        title: 'Please confirm your action',
        closeOnConfirm: false,
        labels: { confirm: 'Next modal', cancel: 'Close modal' },
        children: h(
          Text,
          { size: 'sm' },
          () =>
            'This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.',
        ),
        onConfirm: () =>
          modals.openConfirmModal({
            title: 'This is modal at second layer',
            labels: { confirm: 'Close modal', cancel: 'Back' },
            closeOnConfirm: false,
            children: h(
              Text,
              { size: 'sm' },
              () => 'When this modal is closed modals state will revert to first modal',
            ),
            onConfirm: modals.closeAll,
          }),
      })

    return () => h(Button, { onClick: openMultipleSteps }, () => 'Open multiple steps modal')
  },
})

export const multipleSteps: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
