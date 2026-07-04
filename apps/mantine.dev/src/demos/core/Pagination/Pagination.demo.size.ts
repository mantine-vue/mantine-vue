import { defineComponent, h } from 'vue'
import { Button, Group, Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <Group>
      <Pagination :total="45" size="sm" />
      <Button size="sm">sm button</Button>
    </Group>

    <Group mt="md">
      <Pagination :total="45" size="input-sm" />
      <Button size="sm">sm button</Button>
    </Group>
  </div>
</template>

<script setup lang="ts">
import { Button, Group, Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationSizeDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(
          Group,
          {},
          {
            default: () => [
              h(Pagination, { total: 45, size: 'sm' }),
              h(Button, { size: 'sm' }, { default: () => 'sm button' }),
            ],
          },
        ),
        h(
          Group,
          { mt: 'md' },
          {
            default: () => [
              h(Pagination, { total: 45, size: 'input-sm' }),
              h(Button, { size: 'sm' }, { default: () => 'sm button' }),
            ],
          },
        ),
      ])
  },
})

export const size: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
