import { defineComponent, h } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <Text mb="xs">1 sibling (default)</Text>
    <Pagination :total="20" :siblings="1" :default-value="10" />

    <Text mb="xs" mt="xl">2 siblings</Text>
    <Pagination :total="20" :siblings="2" :default-value="10" />

    <Text mb="xs" mt="xl">3 siblings</Text>
    <Pagination :total="20" :siblings="3" :default-value="10" />
  </div>
</template>

<script setup lang="ts">
import { Pagination, Text } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationSiblingsDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Text, { mb: 'xs' }, { default: () => '1 sibling (default)' }),
        h(Pagination, { total: 20, siblings: 1, defaultValue: 10 }),

        h(Text, { mb: 'xs', mt: 'xl' }, { default: () => '2 siblings' }),
        h(Pagination, { total: 20, siblings: 2, defaultValue: 10 }),

        h(Text, { mb: 'xs', mt: 'xl' }, { default: () => '3 siblings' }),
        h(Pagination, { total: 20, siblings: 3, defaultValue: 10 }),
      ])
  },
})

export const siblings: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
