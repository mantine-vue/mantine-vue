import { defineComponent, h } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { Button, Menu } from '@mantine-vue/core'
</script>

<template>
  <Menu
    shadow="md"
    :width="200"
    loop
    :menu-item-tab-index="0"
  >
    <Menu.Target>
      <Button>Navigation menu</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item component="a" href="#">Home</Menu.Item>
      <Menu.Item component="a" href="#">Docs</Menu.Item>
      <Menu.Item component="a" href="#">Blog</Menu.Item>
      <Menu.Item component="a" href="#">Changelog</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuNavigationDemo',
  setup() {
    return () =>
      h(
        Menu,
        { shadow: 'md', width: 200, loop: true, menuItemTabIndex: 0 },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Navigation menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Item, { component: 'a', href: '#' }, () => 'Home'),
                h(Menu.Item, { component: 'a', href: '#' }, () => 'Docs'),
                h(Menu.Item, { component: 'a', href: '#' }, () => 'Blog'),
                h(Menu.Item, { component: 'a', href: '#' }, () => 'Changelog'),
              ],
            }),
          ],
        },
      )
  },
})

export const navigation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
