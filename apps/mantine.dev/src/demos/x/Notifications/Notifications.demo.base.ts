import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
</script>

<template>
  <Button
    @click="
      notifications.show({
        title: 'Default notification',
        message: 'Do not forget to star Mantine on GitHub! 🌟',
      })
    "
  >
    Show notification
  </Button>
</template>
`

const Demo = defineComponent({
  name: 'NotificationsBaseDemo',
  setup() {
    return () =>
      h(
        Button,
        {
          onClick: () =>
            notifications.show({
              title: 'Default notification',
              message: 'Do not forget to star Mantine on GitHub! 🌟',
            }),
        },
        () => 'Show notification',
      )
  },
})

export const base: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
