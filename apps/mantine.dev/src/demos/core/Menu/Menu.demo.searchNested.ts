import { defineComponent, h, ref } from 'vue'
import { Button, Menu, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Menu, Text } from '@mantine-vue/core'

interface MenuNode { label: string; children?: MenuNode[] }

const data: MenuNode[] = [
  { label: 'Dashboard' },
  { label: 'Customers' },
  {
    label: 'Products',
    children: [
      { label: 'All products' }, { label: 'Categories' },
      { label: 'Tags' }, { label: 'Inventory' },
    ],
  },
  { label: 'Orders' },
  {
    label: 'Settings',
    children: [
      {
        label: 'Account',
        children: [
          { label: 'Profile' }, { label: 'Security' },
          { label: 'Two-factor authentication' },
        ],
      },
      { label: 'Notifications' }, { label: 'Billing' },
    ],
  },
]

function filterTree(nodes: MenuNode[], q: string): MenuNode[] {
  if (!q) return nodes
  return nodes.reduce<MenuNode[]>((acc, node) => {
    const match = node.label.toLowerCase().includes(q)
    const children = node.children ? filterTree(node.children, q) : undefined
    if (match || (children && children.length > 0))
      acc.push({ ...node, children: node.children ? children : undefined })
    return acc
  }, [])
}

const query = ref('')
const items = computed(() => filterTree(data, query.value.toLowerCase().trim()))
</script>

<template>
  <Menu shadow="md" :width="240">
    <Menu.Target><Button>Toggle menu</Button></Menu.Target>
    <Menu.Dropdown>
      <Menu.Search :value="query" @change="(e) => query = e.target.value" placeholder="Search items" />
      <!-- render tree recursively via component -->
    </Menu.Dropdown>
  </Menu>
</template>
`

interface MenuNode {
  label: string
  children?: MenuNode[]
}

const data: MenuNode[] = [
  { label: 'Dashboard' },
  { label: 'Customers' },
  {
    label: 'Products',
    children: [
      { label: 'All products' },
      { label: 'Categories' },
      { label: 'Tags' },
      { label: 'Inventory' },
    ],
  },
  { label: 'Orders' },
  {
    label: 'Settings',
    children: [
      {
        label: 'Account',
        children: [
          { label: 'Profile' },
          { label: 'Security' },
          { label: 'Two-factor authentication' },
        ],
      },
      { label: 'Notifications' },
      { label: 'Billing' },
    ],
  },
]

function filterTree(nodes: MenuNode[], q: string): MenuNode[] {
  if (!q) return nodes
  return nodes.reduce<MenuNode[]>((acc, node) => {
    const match = node.label.toLowerCase().includes(q)
    const children = node.children ? filterTree(node.children, q) : undefined
    if (match || (children && children.length > 0))
      acc.push({ ...node, children: node.children ? children : undefined })
    return acc
  }, [])
}

function renderNode(node: MenuNode): any {
  if (node.children) {
    return h(
      Menu.Sub,
      { key: node.label },
      {
        default: () => [
          h(Menu.Sub.Target, null, {
            default: () => h(Menu.Sub.Item, null, () => node.label),
          }),
          h(Menu.Sub.Dropdown, null, {
            default: () => node.children!.map(renderNode),
          }),
        ],
      },
    )
  }
  return h(Menu.Item, { key: node.label }, () => node.label)
}

const Demo = defineComponent({
  name: 'MenuSearchNestedDemo',
  setup() {
    const query = ref('')

    return () => {
      const items = filterTree(data, query.value.toLowerCase().trim())

      return h(
        Menu,
        { shadow: 'md', width: 240 },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Search, {
                  value: query.value,
                  placeholder: 'Search items',
                  onChange: (e: Event) => {
                    query.value = (e.target as HTMLInputElement).value
                  },
                }),
                items.length > 0
                  ? items.map(renderNode)
                  : h(
                      Text,
                      { c: 'dimmed', size: 'sm', ta: 'center', py: 'xs' },
                      () => 'Nothing found',
                    ),
              ],
            }),
          ],
        },
      )
    }
  },
})

export const searchNested: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
