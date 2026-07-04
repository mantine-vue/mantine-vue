import { defineComponent, h } from 'vue'
import { Button, Menu, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { Button, Menu } from '@mantine-vue/core'
</script>

<template>
  <Menu shadow="md" trigger="hover" :open-delay="100" :close-delay="400">
    <Menu.Target>
      <Button>Hover to open</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item>Settings</Menu.Item>
      <Menu.Item>Messages</Menu.Item>
      <Menu.Item>Gallery</Menu.Item>
      <Menu.Divider />
      <Menu.Item color="red">Delete my account</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuHoverDemo',
  setup() {
    return () =>
      h(
        Menu,
        { shadow: 'md', trigger: 'hover', openDelay: 100, closeDelay: 400 },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Hover to open') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Item, null, () => 'Settings'),
                h(Menu.Item, null, () => 'Messages'),
                h(Menu.Item, null, () => 'Gallery'),
                h(Menu.Divider),
                h(Menu.Item, { color: 'red' }, () => 'Delete my account'),
              ],
            }),
          ],
        },
      )
  },
})

export const hover: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
