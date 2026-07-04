import { defineComponent, h } from 'vue'
import { Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Pagination :total="10"{{props}} />
</template>

<script setup lang="ts">
import { Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(Pagination, { total: 10, ...(attrs as any) })
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'withControls', type: 'boolean', initialValue: true, libraryValue: true },
    { prop: 'withEdges', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'disabled', type: 'boolean', initialValue: false, libraryValue: false },
  ],
}
