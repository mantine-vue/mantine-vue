import { defineComponent, h } from 'vue'
import { Avatar, Button, Group, Text } from '@mantine-vue/core'
import {
  createNotificationsStore,
  Notifications,
  notifications,
  type NotificationData,
} from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

const stackedStore = createNotificationsStore()
export const stacked: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'StackedNotificationsDemo',
    setup: () => () => [
      h(Notifications, { store: stackedStore, layout: 'stacked', position: 'bottom-right' }),
      h(Group, { justify: 'center' }, () =>
        h(
          Button,
          {
            onClick: () =>
              notifications.show(
                {
                  title: 'New notification',
                  message: 'Hover, focus or tap the stack to expand it',
                },
                stackedStore,
              ),
          },
          () => 'Show stacked notification',
        ),
      ),
    ],
  }),
  code: `<script setup lang="ts">
import { Button } from '@mantine-vue/core'
import { Notifications, notifications } from '@mantine-vue/notifications'
</script>
<template>
  <Notifications layout="stacked" />
  <Button @click="notifications.show({ title: 'New notification', message: 'Part of a stacked layout' })">
    Show stacked notification
  </Button>
</template>`,
}

const priorityStore = createNotificationsStore()
export const priority: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    name: 'PriorityNotificationsDemo',
    setup: () => () => [
      h(Notifications, { store: priorityStore, limit: 1, position: 'top-center' }),
      h(Group, { justify: 'center' }, () => [
        h(
          Button,
          {
            color: 'gray',
            onClick: () =>
              notifications.show(
                {
                  title: 'Low priority',
                  message: 'I move to the queue when an urgent notification arrives',
                  autoClose: false,
                  priority: 0,
                },
                priorityStore,
              ),
          },
          () => 'Show low priority',
        ),
        h(
          Button,
          {
            color: 'red',
            onClick: () =>
              notifications.show(
                {
                  title: 'High priority',
                  message: 'I take the visible slot even when the limit is reached',
                  color: 'red',
                  autoClose: false,
                  priority: 10,
                },
                priorityStore,
              ),
          },
          () => 'Show high priority',
        ),
      ]),
    ],
  }),
  code: `<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { createNotificationsStore, Notifications, notifications } from '@mantine-vue/notifications'
const store = createNotificationsStore()
</script>
<template>
  <Notifications :store="store" :limit="1" position="top-center" />
  <Group>
    <Button color="gray" @click="notifications.show({ message: 'Low priority', priority: 0, autoClose: false }, store)">Low priority</Button>
    <Button color="red" @click="notifications.show({ message: 'Urgent', priority: 10, autoClose: false }, store)">High priority</Button>
  </Group>
</template>`,
}

const customStore = createNotificationsStore()
function customNotification(notification: NotificationData) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderRadius: '8px',
        background: 'var(--mantine-color-body)',
        border: '1px solid var(--mantine-color-default-border)',
        boxShadow: 'var(--mantine-shadow-lg)',
      },
    },
    [
      h(Avatar, { radius: 'xl', color: 'blue' }, () => 'DM'),
      h('div', { style: { flex: 1 } }, [
        h(Text, { size: 'sm', fw: 600 }, () => 'Dan sent you a message'),
        h(Text, { size: 'xs', c: 'dimmed' }, () => 'Hey, are you free for a quick call?'),
        h(Group, { gap: 'xs', mt: 8 }, () => [
          h(
            Button,
            {
              size: 'compact-xs',
              onClick: () => notifications.hide(notification.id!, customStore),
            },
            () => 'Reply',
          ),
          h(
            Button,
            {
              size: 'compact-xs',
              variant: 'default',
              onClick: () => notifications.hide(notification.id!, customStore),
            },
            () => 'Dismiss',
          ),
        ]),
      ]),
    ],
  )
}

export const renderNotification: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'CustomNotificationDemo',
    setup: () => () => [
      h(Notifications, { store: customStore }),
      h(Group, { justify: 'center' }, () =>
        h(
          Button,
          {
            onClick: () =>
              notifications.show(
                { autoClose: false, message: '', renderNotification: customNotification },
                customStore,
              ),
          },
          () => 'Show custom notification',
        ),
      ),
    ],
  }),
  code: `<script setup lang="ts">
import { h } from 'vue'
import { Avatar, Button, Group, Text } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'

function show() {
  notifications.show({
    autoClose: false,
    message: '',
    renderNotification: (notification) =>
      h('div', { class: 'message-notification' }, [
        h(Avatar, { radius: 'xl' }, () => 'DM'),
        h(Text, () => 'Dan sent you a message'),
        h(Button, { onClick: () => notifications.hide(notification.id!) }, () => 'Dismiss'),
      ]),
  })
}
</script>
<template><Button @click="show">Show custom notification</Button></template>`,
}
