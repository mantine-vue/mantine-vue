import { defineComponent, h } from 'vue'
import { Rating } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Rating } from '@mantine-vue/core'
</script>

<template>
  <Rating :default-value="2" {{props}} />
</template>
`

const Demo = defineComponent({
  name: 'RatingConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(Rating, { defaultValue: 2, ...attrs })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'yellow', libraryValue: 'yellow' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'count', type: 'number', initialValue: 5, libraryValue: 5, min: 1, max: 8 },
    { prop: 'highlightSelectedOnly', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
