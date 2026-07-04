import { defineComponent, h } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <Text mb="xs">Pages 5–15 (startValue=5, total=15)</Text>
    <Pagination :total="15" :start-value="5" :default-value="5" />
  </div>
</template>

<script setup lang="ts">
import { Pagination, Text } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationStartValueDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Text, { mb: 'xs' }, { default: () => 'Pages 5–15 (startValue=5, total=15)' }),
        h(Pagination, { total: 15, startValue: 5, defaultValue: 5 }),
      ])
  },
})

export const startValue: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
