import { defineComponent, h } from 'vue'
import { RingProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RingProgress } from '@mantine-vue/core'
</script>

<template>
  <RingProgress
    {{props}}
    :sections="[
      { value: 40, color: 'cyan' },
      { value: 15, color: 'orange' },
      { value: 15, color: 'grape' },
    ]"
  />
</template>
`

const Wrapper = defineComponent({
  name: 'RingProgressConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(RingProgress, {
        sections: [
          { value: 40, color: 'cyan' },
          { value: 15, color: 'orange' },
          { value: 15, color: 'grape' },
        ],
        ...(attrs as any),
      })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  centered: true,
  code,
  controls: [
    {
      prop: 'size',
      type: 'number',
      initialValue: 120,
      step: 10,
      min: 60,
      max: 400,
      libraryValue: '__',
    },
    {
      prop: 'thickness',
      type: 'number',
      initialValue: 12,
      step: 1,
      min: 1,
      max: 40,
      libraryValue: '__',
    },
    { prop: 'roundCaps', type: 'boolean', initialValue: true, libraryValue: false },
  ],
}
