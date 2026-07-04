import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import { elementsLong } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'
</script>

<template>
  <Table.ScrollContainer :minWidth="500" :maxHeight="300">
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
  </Table.ScrollContainer>
</template>
`

const Demo = defineComponent({
  name: 'TableScrollContainerMaxHeightDemo',
  setup() {
    return () =>
      h(
        Table.ScrollContainer,
        { minWidth: 500, maxHeight: 300 },
        {
          default: () =>
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
                        elementsLong.map((el) =>
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
            ),
        },
      )
  },
})

export const scrollContainerMaxHeight: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
