import { defineComponent, h } from 'vue'
import { Button, Code, Text } from '@mantine-vue/core'
import { useCounter } from '@mantine-vue/hooks'
import { notifications, useNotifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Code, Text } from '@mantine-vue/core'
import { useCounter } from '@mantine-vue/hooks'
import { notifications, useNotifications } from '@mantine-vue/notifications'

const [counter, { increment }] = useCounter()
const notificationsStore = useNotifications()

function showNotification() {
  notifications.show({
    title: \`Notification \${counter.value}\`,
    message: 'Most notifications are added to queue',
  })

  increment()
}
</script>

<template>
  <Button @click="showNotification" mb="md">Show notification</Button>

  <Text>Notifications state</Text>
  <Code block>{{ JSON.stringify(notificationsStore.notifications, null, 2) }}</Code>

  <Text mt="md">Notifications queue</Text>
  <Code block>{{ JSON.stringify(notificationsStore.queue, null, 2) }}</Code>
</template>
`

const Demo = defineComponent({
  name: 'NotificationsStoreDemo',
  setup() {
    const [counter, { increment }] = useCounter()
    const notificationsStore = useNotifications()

    const showNotification = () => {
      notifications.show({
        title: `Notification ${counter.value}`,
        message: 'Most notifications are added to queue',
      })

      increment()
    }

    return () =>
      h('div', null, [
        h(Button, { onClick: showNotification, mb: 'md' }, () => 'Show notification'),
        h(Text, null, () => 'Notifications state'),
        h(Code, { block: true }, () =>
          JSON.stringify(notificationsStore.value.notifications, null, 2),
        ),
        h(Text, { mt: 'md' }, () => 'Notifications queue'),
        h(Code, { block: true }, () => JSON.stringify(notificationsStore.value.queue, null, 2)),
      ])
  },
})

export const store: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
