import { defineComponent, h } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { usePagination, DOTS } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Text } from '@mantine-vue/core'
import { usePagination, DOTS } from '@mantine-vue/hooks'

const pagination = usePagination({ total: 15, startValue: 5, initialPage: 5 })
</script>

<template>
  <Text>Active page: {{ pagination.active.value }}</Text>
  <Text>Range: [{{ pagination.range.value.join(', ') }}]</Text>
  <Group mt="md" :gap="4">
    <Button size="compact-sm" variant="default" @click="pagination.first">First</Button>
    <Button size="compact-sm" variant="default" @click="pagination.previous">Previous</Button>
    <template v-for="(page, index) in pagination.range.value" :key="index">
      <span v-if="page === DOTS">...</span>
      <Button
        v-else
        size="compact-sm"
        @click="pagination.setPage(page)"
        :variant="pagination.active.value === page ? 'filled' : 'default'"
        :miw="34"
      >
        {{ page }}
      </Button>
    </template>
    <Button size="compact-sm" variant="default" @click="pagination.next">Next</Button>
    <Button size="compact-sm" variant="default" @click="pagination.last">Last</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UsePaginationStartValueDemo',
  setup() {
    const pagination = usePagination({ total: 15, startValue: 5, initialPage: 5 })

    return () =>
      h('div', [
        h(Text, null, { default: () => `Active page: ${pagination.active.value}` }),
        h(Text, null, { default: () => `Range: [${pagination.range.value.join(', ')}]` }),
        h(
          Group,
          { mt: 'md', gap: 4 },
          {
            default: () => [
              h(
                Button,
                { size: 'compact-sm', variant: 'default', onClick: pagination.first },
                { default: () => 'First' },
              ),
              h(
                Button,
                { size: 'compact-sm', variant: 'default', onClick: pagination.previous },
                { default: () => 'Previous' },
              ),
              ...pagination.range.value.map((page, index) =>
                page === DOTS
                  ? h('span', { key: index }, '...')
                  : h(
                      Button,
                      {
                        key: index,
                        size: 'compact-sm',
                        onClick: () => pagination.setPage(page),
                        variant: pagination.active.value === page ? 'filled' : 'default',
                        miw: 34,
                      },
                      { default: () => String(page) },
                    ),
              ),
              h(
                Button,
                { size: 'compact-sm', variant: 'default', onClick: pagination.next },
                { default: () => 'Next' },
              ),
              h(
                Button,
                { size: 'compact-sm', variant: 'default', onClick: pagination.last },
                { default: () => 'Last' },
              ),
            ],
          },
        ),
      ])
  },
})

export const startValue: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
