import { defineComponent, h } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Menu } from '@mantine-vue/core'
</script>

<template>
  <Menu shadow="md" :width="200">
    <Menu.Target>
      <Button>Toggle menu</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item component="a" href="https://mantine-vue" target="_blank">
        Mantine website
      </Menu.Item>
      <Menu.Item component="a" href="https://github.com/mantinedev" target="_blank">
        GitHub
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>Regular item</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuComponentDemo',
  setup() {
    return () =>
      h(
        Menu,
        { shadow: 'md', width: 200 },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(
                  Menu.Item,
                  { component: 'a', href: 'https://mantine-vue', target: '_blank' },
                  () => 'Mantine website',
                ),
                h(
                  Menu.Item,
                  { component: 'a', href: 'https://github.com/mantinedev', target: '_blank' },
                  () => 'GitHub',
                ),
                h(Menu.Divider),
                h(Menu.Item, null, () => 'Regular item'),
              ],
            }),
          ],
        },
      )
  },
})

export const component: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
