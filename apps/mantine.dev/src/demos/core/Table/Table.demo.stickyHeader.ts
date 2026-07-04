import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import { elements } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'

const elements = [/* ... */]
</script>

<template>
  <Table stickyHeader :stickyHeaderOffset="60">
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Element position</Table.Th>
        <Table.Th>Element name</Table.Th>
        <Table.Th>Symbol</Table.Th>
        <Table.Th>Atomic mass</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      <Table.Tr v-for="el in elements" :key="el.name">
        <Table.Td>{{ el.position }}</Table.Td>
        <Table.Td>{{ el.name }}</Table.Td>
        <Table.Td>{{ el.symbol }}</Table.Td>
        <Table.Td>{{ el.mass }}</Table.Td>
      </Table.Tr>
    </Table.Tbody>
    <Table.Caption>Scroll page to see sticky thead</Table.Caption>
  </Table>
</template>
`

const Demo = defineComponent({
  name: 'TableStickyHeaderDemo',
  setup() {
    return () =>
      h(
        Table,
        { stickyHeader: true, stickyHeaderOffset: 60 },
        {
          default: () => [
            h(
              Table.Thead,
              {},
              {
                default: () =>
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, {}, { default: () => 'Element position' }),
                        h(Table.Th, {}, { default: () => 'Element name' }),
                        h(Table.Th, {}, { default: () => 'Symbol' }),
                        h(Table.Th, {}, { default: () => 'Atomic mass' }),
                      ],
                    },
                  ),
              },
            ),
            h(
              Table.Tbody,
              {},
              {
                default: () =>
                  elements.map((el) =>
                    h(
                      Table.Tr,
                      { key: el.name },
                      {
                        default: () => [
                          h(Table.Td, {}, { default: () => el.position }),
                          h(Table.Td, {}, { default: () => el.name }),
                          h(Table.Td, {}, { default: () => el.symbol }),
                          h(Table.Td, {}, { default: () => el.mass }),
                        ],
                      },
                    ),
                  ),
              },
            ),
            h(Table.Caption, {}, { default: () => 'Scroll page to see sticky thead' }),
          ],
        },
      )
  },
})

export const stickyHeader: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
