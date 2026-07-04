import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import { elements } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'
</script>

<template>
  <Table captionSide="bottom">
    <Table.Caption>Some elements from periodic table</Table.Caption>
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
    <Table.Tfoot>
      <Table.Tr>
        <Table.Th>Element position</Table.Th>
        <Table.Th>Element name</Table.Th>
        <Table.Th>Symbol</Table.Th>
        <Table.Th>Atomic mass</Table.Th>
      </Table.Tr>
    </Table.Tfoot>
  </Table>
</template>
`

const headerRow = () =>
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
  )

const Demo = defineComponent({
  name: 'TableCaptionsDemo',
  setup() {
    return () =>
      h(
        Table,
        { captionSide: 'bottom' },
        {
          default: () => [
            h(Table.Caption, {}, { default: () => 'Some elements from periodic table' }),
            h(Table.Thead, {}, { default: headerRow }),
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
            h(Table.Tfoot, {}, { default: headerRow }),
          ],
        },
      )
  },
})

export const captions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
