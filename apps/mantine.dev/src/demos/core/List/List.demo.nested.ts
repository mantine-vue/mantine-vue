import { defineComponent, h } from 'vue'
import { List } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { List } from '@mantine-vue/core'
</script>

<template>
  <List listStyleType="disc">
    <List.Item>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    </List.Item>
    <List.Item>First order item</List.Item>
    <List.Item>
      First order item with list
      <List withPadding listStyleType="disc">
        <List.Item>Nested item</List.Item>
        <List.Item>Nested item</List.Item>
        <List.Item>
          Nested item with list
          <List withPadding listStyleType="disc">
            <List.Item>Even more nested</List.Item>
            <List.Item>Even more nested</List.Item>
          </List>
        </List.Item>
        <List.Item>Nested item</List.Item>
      </List>
    </List.Item>
    <List.Item>First order item</List.Item>
  </List>
</template>
`

const Demo = defineComponent({
  name: 'ListNestedDemo',
  setup() {
    return () =>
      h(
        List,
        { listStyleType: 'disc' },
        {
          default: () => [
            h(
              List.Item,
              {},
              {
                default: () =>
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
              },
            ),
            h(List.Item, {}, { default: () => 'First order item' }),
            h(
              List.Item,
              {},
              {
                default: () => [
                  'First order item with list',
                  h(
                    List,
                    { withPadding: true, listStyleType: 'disc' },
                    {
                      default: () => [
                        h(List.Item, {}, { default: () => 'Nested item' }),
                        h(List.Item, {}, { default: () => 'Nested item' }),
                        h(
                          List.Item,
                          {},
                          {
                            default: () => [
                              'Nested item with list',
                              h(
                                List,
                                { withPadding: true, listStyleType: 'disc' },
                                {
                                  default: () => [
                                    h(List.Item, {}, { default: () => 'Even more nested' }),
                                    h(List.Item, {}, { default: () => 'Even more nested' }),
                                  ],
                                },
                              ),
                            ],
                          },
                        ),
                        h(List.Item, {}, { default: () => 'Nested item' }),
                      ],
                    },
                  ),
                ],
              },
            ),
            h(List.Item, {}, { default: () => 'First order item' }),
          ],
        },
      )
  },
})

export const nested: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
