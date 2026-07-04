import { defineComponent, h } from 'vue'
import { Progress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Progress } from '@mantine-vue/core'
</script>

<template>
  <Progress{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'ProgressUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(Progress, { value: 50, ...(attrs as any) })
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 400,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    {
      prop: 'value',
      type: 'number',
      initialValue: 50,
      max: 100,
      min: 0,
      step: 10,
      libraryValue: '__',
    },
    { prop: 'striped', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'animated', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
