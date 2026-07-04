import { defineComponent, h } from 'vue'
import { Badge } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge } from '@mantine-vue/core'
</script>

<template>
  <Badge{{props}}>Badge</Badge>
</template>
`

const Wrapper = defineComponent({
  name: 'BadgeUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Badge, { ...(attrs as any) }, { default: () => 'Badge' })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      prop: 'variant',
      type: 'select',
      initialValue: 'filled',
      libraryValue: 'filled',
      data: ['filled', 'light', 'outline', 'dot', 'transparent', 'default', 'white'],
    },
    { type: 'color', prop: 'color', initialValue: 'blue', libraryValue: null },
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' },
    { type: 'size', prop: 'radius', initialValue: 'xl', libraryValue: 'xl' },
  ],
}
