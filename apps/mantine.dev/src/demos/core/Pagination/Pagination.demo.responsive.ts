import { defineComponent, h } from 'vue'
import { Box, Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Box :style="{ resize: 'horizontal', overflow: 'auto', minWidth: '200px', maxWidth: '100%' }">
    <Pagination :total="20" layout="responsive" />
  </Box>
</template>

<script setup lang="ts">
import { Box, Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationResponsiveDemo',
  setup() {
    return () =>
      h(
        Box,
        { style: { resize: 'horizontal', overflow: 'auto', minWidth: '200px', maxWidth: '100%' } },
        {
          default: () => h(Pagination, { total: 20, layout: 'responsive' }),
        },
      )
  },
})

export const responsive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
