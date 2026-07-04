import { defineComponent, h } from 'vue'
import { Avatar } from '@mantine-vue/core'
import { avatars } from './_mockdata'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar } from '@mantine-vue/core'
</script>

<template>
  <Avatar.Group>
    <Avatar src="image.png" />
    <Avatar src="image.png" />
    <Avatar src="image.png" />
    <Avatar>+5</Avatar>
  </Avatar.Group>
</template>
`

const Demo = defineComponent({
  name: 'AvatarGroupDemo',
  setup() {
    return () =>
      h(
        Avatar.Group,
        {},
        {
          default: () => [
            h(Avatar, { src: avatars[0] }),
            h(Avatar, { src: avatars[1] }),
            h(Avatar, { src: avatars[2] }),
            h(Avatar, {}, { default: () => '+5' }),
          ],
        },
      )
  },
})

export const group: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
