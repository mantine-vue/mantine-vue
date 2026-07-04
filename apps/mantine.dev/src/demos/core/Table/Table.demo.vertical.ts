import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'
</script>

<template>
  <Table variant="vertical" layout="fixed" withTableBorder>
    <Table.Tbody>
      <Table.Tr>
        <Table.Th :w="160">Epic name</Table.Th>
        <Table.Td>7.x migration</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>Status</Table.Th>
        <Table.Td>Open</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>Total issues</Table.Th>
        <Table.Td>135</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>Total story points</Table.Th>
        <Table.Td>874</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>Last updated at</Table.Th>
        <Table.Td>September 26, 2024 17:41:26</Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
`

const Demo = defineComponent({
  name: 'TableVerticalDemo',
  setup() {
    return () =>
      h(
        Table,
        { variant: 'vertical', layout: 'fixed', withTableBorder: true },
        {
          default: () =>
            h(
              Table.Tbody,
              {},
              {
                default: () => [
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, { w: 160 }, { default: () => 'Epic name' }),
                        h(Table.Td, {}, { default: () => '7.x migration' }),
                      ],
                    },
                  ),
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, {}, { default: () => 'Status' }),
                        h(Table.Td, {}, { default: () => 'Open' }),
                      ],
                    },
                  ),
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, {}, { default: () => 'Total issues' }),
                        h(Table.Td, {}, { default: () => '135' }),
                      ],
                    },
                  ),
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, {}, { default: () => 'Total story points' }),
                        h(Table.Td, {}, { default: () => '874' }),
                      ],
                    },
                  ),
                  h(
                    Table.Tr,
                    {},
                    {
                      default: () => [
                        h(Table.Th, {}, { default: () => 'Last updated at' }),
                        h(Table.Td, {}, { default: () => 'September 26, 2024 17:41:26' }),
                      ],
                    },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
