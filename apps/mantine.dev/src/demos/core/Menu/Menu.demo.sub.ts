import { defineComponent, h } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { Button, Menu } from '@mantine-vue/core'
</script>

<template>
  <Menu :width="200" position="bottom-start">
    <Menu.Target>
      <Button>Toggle Menu</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item>Dashboard</Menu.Item>

      <Menu.Sub :open-delay="120" :close-delay="150">
        <Menu.Sub.Target>
          <Menu.Sub.Item>Products</Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          <Menu.Item>All products</Menu.Item>
          <Menu.Item>Categories</Menu.Item>
          <Menu.Item>Tags</Menu.Item>
          <Menu.Item>Attributes</Menu.Item>
          <Menu.Item>Shipping classes</Menu.Item>
        </Menu.Sub.Dropdown>
      </Menu.Sub>

      <Menu.Item>Customers</Menu.Item>
      <Menu.Item>Reports</Menu.Item>

      <Menu.Sub>
        <Menu.Sub.Target>
          <Menu.Sub.Item>Orders</Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          <Menu.Item>Open</Menu.Item>
          <Menu.Item>Completed</Menu.Item>
          <Menu.Item>Cancelled</Menu.Item>
        </Menu.Sub.Dropdown>
      </Menu.Sub>

      <Menu.Sub>
        <Menu.Sub.Target>
          <Menu.Sub.Item>Settings</Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Item>Security</Menu.Item>
          <Menu.Item>Notifications</Menu.Item>
        </Menu.Sub.Dropdown>
      </Menu.Sub>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuSubDemo',
  setup() {
    return () =>
      h(
        Menu,
        { width: 200, position: 'bottom-start' },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle Menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Item, null, () => 'Dashboard'),
                h(
                  Menu.Sub,
                  { openDelay: 120, closeDelay: 150 },
                  {
                    default: () => [
                      h(Menu.Sub.Target, null, {
                        default: () => h(Menu.Sub.Item, null, () => 'Products'),
                      }),
                      h(Menu.Sub.Dropdown, null, {
                        default: () => [
                          h(Menu.Item, null, () => 'All products'),
                          h(Menu.Item, null, () => 'Categories'),
                          h(Menu.Item, null, () => 'Tags'),
                          h(Menu.Item, null, () => 'Attributes'),
                          h(Menu.Item, null, () => 'Shipping classes'),
                        ],
                      }),
                    ],
                  },
                ),
                h(Menu.Item, null, () => 'Customers'),
                h(Menu.Item, null, () => 'Reports'),
                h(Menu.Sub, null, {
                  default: () => [
                    h(Menu.Sub.Target, null, {
                      default: () => h(Menu.Sub.Item, null, () => 'Orders'),
                    }),
                    h(Menu.Sub.Dropdown, null, {
                      default: () => [
                        h(Menu.Item, null, () => 'Open'),
                        h(Menu.Item, null, () => 'Completed'),
                        h(Menu.Item, null, () => 'Cancelled'),
                      ],
                    }),
                  ],
                }),
                h(Menu.Sub, null, {
                  default: () => [
                    h(Menu.Sub.Target, null, {
                      default: () => h(Menu.Sub.Item, null, () => 'Settings'),
                    }),
                    h(Menu.Sub.Dropdown, null, {
                      default: () => [
                        h(Menu.Item, null, () => 'Profile'),
                        h(Menu.Item, null, () => 'Security'),
                        h(Menu.Item, null, () => 'Notifications'),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      )
  },
})

export const sub: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
