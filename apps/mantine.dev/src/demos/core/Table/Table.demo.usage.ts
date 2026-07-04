import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import { elements } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
]
</script>

<template>
  <Table>
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
  </Table>
</template>
`

const Demo = defineComponent({
  name: 'TableUsageDemo',
  setup() {
    return () =>
      h(
        Table,
        {},
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
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
