import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'

function showNotifications() {
  Array(10)
    .fill(0)
    .forEach((_, index) => {
      notifications.show({
        title: \`Notification \${index + 1}\`,
        message: 'Most notifications are added to queue',
        autoClose: false,
      })
    })
}
</script>

<template>
  <Group justify="center">
    <Button @click="showNotifications">Show 10 notifications</Button>

    <Button variant="default" @click="notifications.cleanQueue()">Clean queue</Button>

    <Button variant="outline" color="red" @click="notifications.clean()">Clean all</Button>
  </Group>
</template>
`

function showNotifications() {
  Array(10)
    .fill(0)
    .forEach((_, index) => {
      notifications.show({
        title: `Notification ${index + 1}`,
        message: 'Most notifications are added to queue',
        autoClose: false,
      })
    })
}

const Demo = defineComponent({
  name: 'NotificationsCleanDemo',
  setup() {
    return () =>
      h(Group, { justify: 'center' }, () => [
        h(Button, { onClick: showNotifications }, () => 'Show 10 notifications'),
        h(
          Button,
          { variant: 'default', onClick: () => notifications.cleanQueue() },
          () => 'Clean queue',
        ),
        h(
          Button,
          { variant: 'outline', color: 'red', onClick: () => notifications.clean() },
          () => 'Clean all',
        ),
      ])
  },
})

export const clean: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
