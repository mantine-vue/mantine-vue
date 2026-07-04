import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { PhCheck } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Button } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { PhCheck } from '@phosphor-icons/vue'

function showUpdateNotification() {
  const id = notifications.show({
    loading: true,
    title: 'Loading your data',
    message: 'Data will be loaded in 3 seconds, you cannot close this yet',
    autoClose: false,
    allowClose: false,
  })

  setTimeout(() => {
    notifications.update({
      id,
      color: 'teal',
      title: 'Data was loaded',
      message: 'Notification will close in 2 seconds, you can close this notification now',
      icon: h(PhCheck, { size: 18 }),
      loading: false,
      autoClose: 2000,
      allowClose: true,
    })
  }, 3000)
}
</script>

<template>
  <Button @click="showUpdateNotification">Show update notification</Button>
</template>
`

function showUpdateNotification() {
  const id = notifications.show({
    loading: true,
    title: 'Loading your data',
    message: 'Data will be loaded in 3 seconds, you cannot close this yet',
    autoClose: false,
    allowClose: false,
  })

  setTimeout(() => {
    notifications.update({
      id,
      color: 'teal',
      title: 'Data was loaded',
      message: 'Notification will close in 2 seconds, you can close this notification now',
      icon: h(PhCheck, { size: 18 }),
      loading: false,
      autoClose: 2000,
      allowClose: true,
    })
  }, 3000)
}

const Demo = defineComponent({
  name: 'NotificationsUpdateDemo',
  setup() {
    return () => h(Button, { onClick: showUpdateNotification }, () => 'Show update notification')
  },
})

export const update: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
