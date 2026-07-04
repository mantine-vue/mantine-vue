import { defineComponent, h } from 'vue'
import { Avatar, Group } from '@mantine-vue/core'
import { PhStar } from '@phosphor-icons/vue'
import { avatars } from './_mockdata'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar } from '@mantine-vue/core'
import { PhStar } from '@phosphor-icons/vue'
</script>

<template>
  <!-- With image -->
  <Avatar src="avatar.png" alt="it's me" />

  <!-- Default placeholder -->
  <Avatar radius="xl" />

  <!-- Letters with xl radius -->
  <Avatar color="cyan" radius="xl">MK</Avatar>

  <!-- Custom placeholder icon -->
  <Avatar color="blue" radius="sm">
    <PhStar :size="20" />
  </Avatar>
</template>
`

const Demo = defineComponent({
  name: 'AvatarUsageDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(Avatar, { src: avatars[0], alt: "it's me" }),
            h(Avatar, { radius: 'xl' }),
            h(Avatar, { color: 'cyan', radius: 'xl' }, { default: () => 'MK' }),
            h(Avatar, { color: 'blue', radius: 'sm' }, { default: () => h(PhStar, { size: 20 }) }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
