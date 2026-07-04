import { defineComponent, h } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <Text>autoContrast: off</Text>
    <Pagination :total="10" color="lime.4" />

    <Text mt="md">autoContrast: on</Text>
    <Pagination :total="10" auto-contrast color="lime.4" />
  </div>
</template>

<script setup lang="ts">
import { Pagination, Text } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationAutoContrastDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Text, {}, { default: () => 'autoContrast: off' }),
        h(Pagination, { total: 10, color: 'lime.4' }),

        h(Text, { mt: 'md' }, { default: () => 'autoContrast: on' }),
        h(Pagination, { total: 10, autoContrast: true, color: 'lime.4' }),
      ])
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
