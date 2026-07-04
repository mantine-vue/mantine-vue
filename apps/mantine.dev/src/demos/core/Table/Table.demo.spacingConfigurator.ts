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
  name: 'TableSpacingConfiguratorDemo',
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
                        h(Table.Th, {}, { default: () => 'Position' }),
                        h(Table.Th, {}, { default: () => 'Name' }),
                        h(Table.Th, {}, { default: () => 'Symbol' }),
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

export const spacingConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'horizontalSpacing', type: 'size', libraryValue: 'xs', initialValue: 'xs' },
    { prop: 'verticalSpacing', type: 'size', initialValue: 'xs', libraryValue: 'xs' },
  ],
}
