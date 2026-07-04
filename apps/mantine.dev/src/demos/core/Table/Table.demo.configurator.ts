import { defineComponent, h } from 'vue'
import { Table } from '@mantine-vue/core'
import { elements } from './_data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Table } from '@mantine-vue/core'
</script>

<template>
  <Table{{props}}>
    <!-- rows -->
  </Table>
</template>
`

const Wrapper = defineComponent({
  name: 'TableConfiguratorDemo',
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

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'striped', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'highlightOnHover', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'withTableBorder', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'withColumnBorders', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'withRowBorders', type: 'boolean', initialValue: true, libraryValue: true },
  ],
}
