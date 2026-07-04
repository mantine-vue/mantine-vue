import { defineComponent, h } from 'vue'
import { Group, Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Pagination.Root :total="10">
    <Group :gap="5" justify="center">
      <Pagination.First />
      <Pagination.Previous />
      <Pagination.Items />
      <Pagination.Next />
      <Pagination.Last />
    </Group>
  </Pagination.Root>
</template>

<script setup lang="ts">
import { Group, Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationCompositionDemo',
  setup() {
    return () =>
      h(
        Pagination.Root,
        { total: 10 },
        {
          default: () =>
            h(
              Group,
              { gap: 5, justify: 'center' },
              {
                default: () => [
                  h(Pagination.First),
                  h(Pagination.Previous),
                  h(Pagination.Items),
                  h(Pagination.Next),
                  h(Pagination.Last),
                ],
              },
            ),
        },
      )
  },
})

export const composition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
