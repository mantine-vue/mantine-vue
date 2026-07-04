import { defineComponent, h, ref, computed } from 'vue'
import { Group, Pagination, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Group, Pagination, Text } from '@mantine-vue/core'

const limit = 10
const total = 145
const totalPages = Math.ceil(total / limit)

const page = ref(1)
const message = computed(
  () => \`Showing \${limit * (page.value - 1) + 1} – \${Math.min(total, limit * page.value)} of \${total}\`
)
</script>

<template>
  <Group justify="flex-end">
    <Text size="sm">{{ message }}</Text>
    <Pagination :total="totalPages" :value="page" @change="page = $event" :with-pages="false" />
  </Group>
</template>
`

const limit = 10
const total = 145
const totalPages = Math.ceil(total / limit)

const Demo = defineComponent({
  name: 'PaginationWithPagesDemo',
  setup() {
    const page = ref(1)
    const message = computed(
      () =>
        `Showing ${limit * (page.value - 1) + 1} – ${Math.min(total, limit * page.value)} of ${total}`,
    )

    return () =>
      h(
        Group,
        { justify: 'flex-end' },
        {
          default: () => [
            h(Text, { size: 'sm' }, { default: () => message.value }),
            h(Pagination, {
              total: totalPages,
              value: page.value,
              onChange: (p: number) => {
                page.value = p
              },
              withPages: false,
            }),
          ],
        },
      )
  },
})

export const withPages: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
