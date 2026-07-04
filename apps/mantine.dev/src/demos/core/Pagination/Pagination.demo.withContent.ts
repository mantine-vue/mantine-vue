import { defineComponent, h, ref, computed } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Pagination, Text } from '@mantine-vue/core'

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return []
  const head = array.slice(0, size)
  const tail = array.slice(size)
  return [head, ...chunk(tail, size)]
}

const data = chunk(
  Array.from({ length: 30 }, (_, i) => ({ id: i, name: \`item-\${Math.random().toString(36).slice(2, 8)}\` })),
  5
)

const activePage = ref(1)
const items = computed(() => data[activePage.value - 1])
</script>

<template>
  <div>
    <Text v-for="item in items" :key="item.id">
      id: {{ item.id }}, name: {{ item.name }}
    </Text>
    <Pagination :total="data.length" :value="activePage" @change="activePage = $event" mt="sm" />
  </div>
</template>
`

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return []
  const head = array.slice(0, size)
  const tail = array.slice(size)
  return [head, ...chunk(tail, size)]
}

const data = chunk(
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    name: `item-${Math.random().toString(36).slice(2, 8)}`,
  })),
  5,
)

const Demo = defineComponent({
  name: 'PaginationWithContentDemo',
  setup() {
    const activePage = ref(1)
    const items = computed(() => data[activePage.value - 1])

    return () =>
      h('div', {}, [
        ...items.value.map((item) =>
          h(Text, { key: item.id }, { default: () => `id: ${item.id}, name: ${item.name}` }),
        ),
        h(Pagination, {
          total: data.length,
          value: activePage.value,
          onChange: (page: number) => {
            activePage.value = page
          },
          mt: 'sm',
        }),
      ])
  },
})

export const withContent: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
