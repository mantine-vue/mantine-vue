import { defineComponent, h } from 'vue'
import { ActionIcon, Group, Table } from '@mantine-vue/core'
import { useMap } from '@mantine-vue/hooks'
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ActionIcon, Group, Table } from '@mantine-vue/core'
import { PhPlus, PhTrash } from '@phosphor-icons/vue'
import { useMap } from '@mantine-vue/hooks'

const map = useMap([
  ['/hooks/use-media-query', 4124],
  ['/hooks/use-clipboard', 8341],
  ['/hooks/use-fetch', 9001],
])
</script>

<template>
  <Table layout="fixed">
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Page</Table.Th>
        <Table.Th>Views last month</Table.Th>
        <Table.Th />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      <Table.Tr v-for="[key, value] in map.entries()" :key="key">
        <Table.Td>{{ key }}</Table.Td>
        <Table.Td>{{ value }}</Table.Td>
        <Table.Td>
          <Group>
            <ActionIcon variant="default" @click="map.set(key, value + 1)">
              <PhPlus :size="18" />
            </ActionIcon>
            <ActionIcon variant="default" c="red" @click="map.delete(key)">
              <PhTrash :size="18" />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
`

const Demo = defineComponent({
  name: 'UseMapUsageDemo',
  setup() {
    const map = useMap<string, number>([
      ['/hooks/use-media-query', 4124],
      ['/hooks/use-clipboard', 8341],
      ['/hooks/use-fetch', 9001],
    ])

    return () =>
      h(Table, { layout: 'fixed' }, () => [
        h(Table.Thead, null, () =>
          h(Table.Tr, null, () => [
            h(Table.Th, null, () => 'Page'),
            h(Table.Th, null, () => 'Views last month'),
            h(Table.Th, null, () => null),
          ]),
        ),
        h(Table.Tbody, null, () =>
          Array.from(map.entries()).map(([key, value]) =>
            h(Table.Tr, { key }, () => [
              h(Table.Td, null, () => key),
              h(Table.Td, null, () => value),
              h(Table.Td, null, () =>
                h(Group, null, () => [
                  h(
                    ActionIcon,
                    { variant: 'default', onClick: () => map.set(key, value + 1) },
                    () => h(PhPlus, { size: 18 }),
                  ),
                  h(
                    ActionIcon,
                    { variant: 'default', c: 'red', onClick: () => map.delete(key) },
                    () => h(PhTrash, { size: 18 }),
                  ),
                ]),
              ),
            ]),
          ),
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
