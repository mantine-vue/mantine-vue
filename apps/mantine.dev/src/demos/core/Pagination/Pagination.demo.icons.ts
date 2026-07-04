import { defineComponent, h } from 'vue'
import {
  PhArrowLeft,
  PhArrowRight,
  PhArrowLineLeft,
  PhArrowLineRight,
  PhDotsSix,
} from '@phosphor-icons/vue'
import { Group, Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <!-- Compound pagination with custom icons -->
    <Pagination.Root :total="10">
      <Group :gap="7">
        <Pagination.First :icon="PhArrowLineLeft" />
        <Pagination.Previous :icon="PhArrowLeft" />
        <Pagination.Items />
        <Pagination.Next :icon="PhArrowRight" />
        <Pagination.Last :icon="PhArrowLineRight" />
      </Group>
    </Pagination.Root>
  </div>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhArrowRight, PhArrowLineLeft, PhArrowLineRight } from '@phosphor-icons/vue'
import { Group, Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationIconsDemo',
  setup() {
    return () =>
      h(
        Pagination.Root,
        { total: 10 },
        {
          default: () =>
            h(
              Group,
              { gap: 7 },
              {
                default: () => [
                  h(Pagination.First, { icon: PhArrowLineLeft }),
                  h(Pagination.Previous, { icon: PhArrowLeft }),
                  h(Pagination.Items),
                  h(Pagination.Next, { icon: PhArrowRight }),
                  h(Pagination.Last, { icon: PhArrowLineRight }),
                ],
              },
            ),
        },
      )
  },
})

export const icons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
