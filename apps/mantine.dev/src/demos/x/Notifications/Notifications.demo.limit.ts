import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'

function showNotifications() {
  Array(10)
    .fill(0)
    .forEach((_, index) => {
      setTimeout(() => {
        notifications.show({
          title: \`Notification \${index + 1}\`,
          message: 'Most notifications are added to queue',
        })
      }, 200 * index)
    })
}
</script>

<template>
  <Button @click="showNotifications">Show 10 notifications</Button>
</template>
`

function showNotifications() {
  Array(10)
    .fill(0)
    .forEach((_, index) => {
      setTimeout(() => {
        notifications.show({
          title: `Notification ${index + 1}`,
          message: 'Most notifications are added to queue',
        })
      }, 200 * index)
    })
}

const Demo = defineComponent({
  name: 'NotificationsLimitDemo',
  setup() {
    return () => h(Button, { onClick: showNotifications }, () => 'Show 10 notifications')
  },
})

export const limit: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
