import { defineComponent, h } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <Text mb="xs">1 boundary (default)</Text>
    <Pagination :total="20" :boundaries="1" :default-value="10" />

    <Text mt="xl" mb="xs">2 boundaries</Text>
    <Pagination :total="20" :boundaries="2" :default-value="10" />

    <Text mt="xl" mb="xs">3 boundaries</Text>
    <Pagination :total="20" :boundaries="3" :default-value="10" />
  </div>
</template>

<script setup lang="ts">
import { Pagination, Text } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationBoundariesDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Text, { mb: 'xs' }, { default: () => '1 boundary (default)' }),
        h(Pagination, { total: 20, boundaries: 1, defaultValue: 10 }),

        h(Text, { mt: 'xl', mb: 'xs' }, { default: () => '2 boundaries' }),
        h(Pagination, { total: 20, boundaries: 2, defaultValue: 10 }),

        h(Text, { mt: 'xl', mb: 'xs' }, { default: () => '3 boundaries' }),
        h(Pagination, { total: 20, boundaries: 3, defaultValue: 10 }),
      ])
  },
})

export const boundaries: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
