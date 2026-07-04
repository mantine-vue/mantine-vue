import { defineComponent, h } from 'vue'
import { Group, Pagination } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <div>
    <!-- Regular pagination with link items -->
    <Pagination
      :total="10"
      with-edges
      :get-item-props="(page) => ({ component: 'a', href: \`#page-\${page}\` })"
    />

    <!-- Compound pagination with link controls -->
    <Pagination.Root
      :total="10"
      :get-item-props="(page) => ({ component: 'a', href: \`#page-\${page}\` })"
    >
      <Group :gap="7" mt="xl">
        <Pagination.First component="a" href="#page-0" />
        <Pagination.Previous component="a" href="#page-1" />
        <Pagination.Items />
        <Pagination.Next component="a" href="#page-2" />
        <Pagination.Last component="a" href="#page-10" />
      </Group>
    </Pagination.Root>
  </div>
</template>

<script setup lang="ts">
import { Group, Pagination } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'PaginationLinksDemo',
  setup() {
    return () =>
      h('div', {}, [
        h(Pagination, {
          total: 10,
          withEdges: true,
          getItemProps: (page: number) => ({ component: 'a', href: `#page-${page}` }),
        }),

        h(
          Pagination.Root,
          {
            total: 10,
            getItemProps: (page: number) => ({ component: 'a', href: `#page-${page}` }),
          },
          {
            default: () =>
              h(
                Group,
                { gap: 7, mt: 'xl' },
                {
                  default: () => [
                    h(Pagination.First, { component: 'a', href: '#page-0' }),
                    h(Pagination.Previous, { component: 'a', href: '#page-1' }),
                    h(Pagination.Items),
                    h(Pagination.Next, { component: 'a', href: '#page-2' }),
                    h(Pagination.Last, { component: 'a', href: '#page-10' }),
                  ],
                },
              ),
          },
        ),
      ])
  },
})

export const links: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
