import { defineComponent, h } from 'vue'
import { NumberFormatter, Table } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberFormatter, Table } from '@mantine-vue/core'

const data = [
  { product: 'Apples', unitsSold: 2214411234 },
  { product: 'Oranges', unitsSold: 9983812411 },
  { product: 'Bananas', unitsSold: 1234567890 },
  { product: 'Pineapples', unitsSold: 9948810000 },
  { product: 'Pears', unitsSold: 9933771111 },
]
</script>

<template>
  <Table{{props}}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Product</Table.Th>
        <Table.Th>Units sold</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      <Table.Tr v-for="item in data" :key="item.product">
        <Table.Td>{{ item.product }}</Table.Td>
        <Table.Td>
          <NumberFormatter :value="item.unitsSold" thousandSeparator />
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
`

const salesData = [
  { product: 'Apples', unitsSold: 2214411234 },
  { product: 'Oranges', unitsSold: 9983812411 },
  { product: 'Bananas', unitsSold: 1234567890 },
  { product: 'Pineapples', unitsSold: 9948810000 },
  { product: 'Pears', unitsSold: 9933771111 },
]

const Wrapper = defineComponent({
  name: 'TableTabularNumsDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Table,
        { ...(attrs as any) },
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
                        h(Table.Th, {}, { default: () => 'Product' }),
                        h(Table.Th, {}, { default: () => 'Units sold' }),
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
                  salesData.map((item) =>
                    h(
                      Table.Tr,
                      { key: item.product },
                      {
                        default: () => [
                          h(Table.Td, {}, { default: () => item.product }),
                          h(
                            Table.Td,
                            {},
                            {
                              default: () =>
                                h(NumberFormatter, {
                                  value: item.unitsSold,
                                  thousandSeparator: true,
                                }),
                            },
                          ),
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

export const tabularNums: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ type: 'boolean', prop: 'tabularNums', initialValue: true, libraryValue: false }],
}
