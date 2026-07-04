import { defineComponent, h } from 'vue'
import { Avatar } from '@mantine-vue/core'
import { avatars } from './_mockdata'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar } from '@mantine-vue/core'
</script>

<template>
  <Avatar
    component="a"
    href="https://github.com/rtivital"
    target="_blank"
    src="avatar.png"
    alt="it's me"
  />
</template>
`

const Demo = defineComponent({
  name: 'AvatarLinkDemo',
  setup() {
    return () =>
      h(Avatar, {
        component: 'a',
        href: 'https://github.com/rtivital',
        target: '_blank',
        src: avatars[0],
        alt: "it's me",
      })
  },
})

export const link: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
