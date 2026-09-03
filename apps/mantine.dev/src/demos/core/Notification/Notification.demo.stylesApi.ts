import { defineComponent, h } from 'vue'
import { PhCheck } from '@phosphor-icons/vue'
import { Box, Notification } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const Demo = defineComponent({
  name: 'NotificationStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Box, { maw: 400, mx: 'auto' }, () => [
        h(
          Notification,
          { title: 'Please wait', loading: true, withCloseButton: false, ...attrs },
          () => 'The application is trying to reconnect to the server',
        ),
        h(
          Notification,
          { mt: 'md', icon: h(PhCheck, { size: 18 }), title: 'We notify you that', ...attrs },
          () => 'You are now obligated to give a star to Mantine Vue on GitHub',
        ),
      ])
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  component: Demo,
  centered: true,
  dimmed: true,
  data: {
    selectors: {
      root: 'Root element',
      icon: 'Icon wrapper',
      loader: 'Loader component',
      body: 'Title and description wrapper',
      title: 'Title element',
      description: 'Notification message',
      closeButton: 'Close button',
    },
  },
  code: `<script setup lang="ts">
import { Notification } from '@mantine-vue/core'
</script>
<template>
  <Notification title="We notify you that"{{props}}>
    You are now obligated to give a star to Mantine Vue on GitHub
  </Notification>
</template>`,
}
