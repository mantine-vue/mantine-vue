import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
</script>

<template>
  <Group justify="center">
    <Button @click="notifications.show({ message: 'I will close in 4 seconds' })">
      Notifications Provider timeout
    </Button>

    <Button
      @click="
        notifications.show({
          message: 'I will close in 500ms',
          autoClose: 500,
        })
      "
    >
      Closes in 500ms
    </Button>

    <Button
      @click="
        notifications.show({
          color: 'blue',
          title: 'I will never close',
          message: 'unless you click X',
          autoClose: false,
        })
      "
    >
      Never closes automatically
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'NotificationsAutocloseDemo',
  setup() {
    return () =>
      h(Group, { justify: 'center' }, () => [
        h(
          Button,
          { onClick: () => notifications.show({ message: 'I will close in 4 seconds' }) },
          () => 'Notifications Provider timeout',
        ),
        h(
          Button,
          {
            onClick: () =>
              notifications.show({
                message: 'I will close in 500ms',
                autoClose: 500,
              }),
          },
          () => 'Closes in 500ms',
        ),
        h(
          Button,
          {
            onClick: () =>
              notifications.show({
                color: 'blue',
                title: 'I will never close',
                message: 'unless you click X',
                autoClose: false,
              }),
          },
          () => 'Never closes automatically',
        ),
      ])
  },
})

export const autoclose: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
