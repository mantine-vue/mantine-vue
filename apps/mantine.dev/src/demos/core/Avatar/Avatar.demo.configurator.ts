import { defineComponent, h } from 'vue'
import { Avatar } from '@mantine-vue/core'
import { staticVariantsControl } from '../../shared/variants-data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Avatar } from '@mantine-vue/core'
</script>

<template>
  <Avatar{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'AvatarConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Avatar, { ...(attrs as any) })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  centered: true,
  code,
  controls: [
    staticVariantsControl,
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: '100%' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'color', type: 'color', initialValue: 'gray', libraryValue: 'gray' },
    { prop: 'src', type: 'string', initialValue: '', libraryValue: null },
  ],
}
