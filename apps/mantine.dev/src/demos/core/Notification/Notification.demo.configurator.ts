import { defineComponent, h } from 'vue'
import { Box, Notification } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Notification } from '@mantine-vue/core'
</script>

<template>
  <Notification{{props}}>
    {{children}}
  </Notification>
</template>
`

const Wrapper = defineComponent({
  name: 'NotificationConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => {
      const { children, ...rest } = attrs as any
      return h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () =>
            h(
              Notification,
              { onClose: () => {}, ...rest },
              {
                default: () =>
                  children ?? 'You are now obligated to give a star to Mantine project on GitHub',
              },
            ),
        },
      )
    }
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  centered: true,
  code,
  dimmed: true,
  controls: [
    { prop: 'loading', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'withCloseButton', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'withBorder', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'title', type: 'string', initialValue: 'We notify you that', libraryValue: '' },
    {
      prop: 'children',
      type: 'string',
      initialValue: 'You are now obligated to give a star to Mantine project on GitHub',
      libraryValue: '',
    },
  ],
}
