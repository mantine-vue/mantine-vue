import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'
import classes from './Notifications.demo.customize.module.css'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import classes from './Demo.module.css'
</script>

<template>
  <Group justify="center">
    <Button
      @click="
        notifications.show({
          title: 'Notification with custom styles',
          message: 'It is default blue',
          classNames: classes,
        })
      "
    >
      Default notification
    </Button>

    <Button
      color="red"
      @click="
        notifications.show({
          color: 'red',
          title: 'Notification with custom styles',
          message: 'It is red',
          classNames: classes,
        })
      "
    >
      Error notification
    </Button>
  </Group>
</template>
`

const cssCode = `
.root {
  background-color: var(--notification-color, var(--mantine-primary-color-filled));

  &::before {
    background-color: var(--mantine-color-white);
  }
}

.description,
.title {
  color: var(--mantine-color-white);
}

.closeButton {
  color: var(--mantine-color-white);

  @mixin hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
`

const Demo = defineComponent({
  name: 'NotificationsCustomizeDemo',
  setup() {
    return () =>
      h(Group, { justify: 'center' }, () => [
        h(
          Button,
          {
            onClick: () =>
              notifications.show({
                title: 'Notification with custom styles',
                message: 'It is default blue',
                classNames: classes,
              }),
          },
          () => 'Default notification',
        ),
        h(
          Button,
          {
            color: 'red',
            onClick: () =>
              notifications.show({
                color: 'red',
                title: 'Notification with custom styles',
                message: 'It is red',
                classNames: classes,
              }),
          },
          () => 'Error notification',
        ),
      ])
  },
})

export const customize: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'vue' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
