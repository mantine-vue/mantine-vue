import { defineComponent, h } from 'vue'
import { ThemeIcon } from '@mantine-vue/core'
import { PhImage } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ThemeIcon } from '@mantine-vue/core'
import { PhImage } from '@phosphor-icons/vue'
</script>

<template>
  <ThemeIcon{{props}}>
    <PhImage :style="{ width: '70%', height: '70%' }" />
  </ThemeIcon>
</template>
`

const Wrapper = defineComponent({
  name: 'ThemeIconUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }, [
        h(
          ThemeIcon,
          { ...(attrs as any) },
          {
            default: () => h(PhImage, { style: { width: '70%', height: '70%' } }),
          },
        ),
      ])
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
      data: [
        { label: 'filled', value: 'filled' },
        { label: 'light', value: 'light' },
        { label: 'outline', value: 'outline' },
        { label: 'default', value: 'default' },
        { label: 'white', value: 'white' },
      ],
    },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
  ],
}
