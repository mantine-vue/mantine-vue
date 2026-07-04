import { defineComponent, h } from 'vue'
import { PhX, PhCheck } from '@phosphor-icons/vue'
import { Notification } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhX, PhCheck } from '@phosphor-icons/vue'
import { Notification } from '@mantine-vue/core'
</script>

<template>
  <Notification :icon="h(PhX, { size: 20 })" color="red" title="Bummer!">
    Something went wrong
  </Notification>
  <Notification :icon="h(PhCheck, { size: 20 })" color="teal" title="All good!" mt="md">
    Everything is fine
  </Notification>
</template>
`

const Demo = defineComponent({
  name: 'NotificationIconDemo',
  setup() {
    return () =>
      h('div', [
        h(
          Notification,
          {
            icon: h(PhX, { size: 20 }),
            color: 'red',
            title: 'Bummer!',
          },
          { default: () => 'Something went wrong' },
        ),
        h(
          Notification,
          {
            icon: h(PhCheck, { size: 20 }),
            color: 'teal',
            title: 'All good!',
            mt: 'md',
          },
          { default: () => 'Everything is fine' },
        ),
      ])
  },
})

export const icon: MantineDemo = {
  type: 'code',
  component: Demo,
  dimmed: true,
  maxWidth: 400,
  centered: true,
  code,
}
