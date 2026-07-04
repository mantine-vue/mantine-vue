import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { modals } from '@mantine-vue/modals'

function openContextModal() {
  modals.openContextModal({
    modal: 'demonstration',
    title: 'Test modal from context',
    innerProps: {
      modalBody:
        'This modal was defined in ModalsProvider, you can open it anywhere in your app with the useModals composable',
    },
  })
}
</script>

<template>
  <Button @click="openContextModal">Open demonstration context modal</Button>
</template>
`

const Demo = defineComponent({
  name: 'ModalsContextDemo',
  setup() {
    const openContextModal = () =>
      modals.openContextModal({
        modal: 'demonstration',
        title: 'Test modal from context',
        innerProps: {
          modalBody:
            'This modal was defined in ModalsProvider, you can open it anywhere in your app with the useModals composable',
        },
      })

    return () => h(Button, { onClick: openContextModal }, () => 'Open demonstration context modal')
  },
})

export const context: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
