import { defineComponent, h } from 'vue'
import { Menu, Menubar, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Menu, Menubar, Text } from '@mantine-vue/core'
</script>

<template>
  <Menubar>
    <Menubar.Menu :width="220">
      <Menubar.Target>File</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>
          New file
          <template #rightSection><Text size="xs" c="dimmed">⌘N</Text></template>
        </Menu.Item>
        <Menu.Item>
          New window
          <template #rightSection><Text size="xs" c="dimmed">⌘⇧N</Text></template>
        </Menu.Item>
        <Menu.Sub>
          <Menu.Sub.Target>
            <Menu.Sub.Item>Open recent</Menu.Sub.Item>
          </Menu.Sub.Target>
          <Menu.Sub.Dropdown>
            <Menu.Item>project-alpha</Menu.Item>
            <Menu.Item>project-beta</Menu.Item>
            <Menu.Item>project-gamma</Menu.Item>
          </Menu.Sub.Dropdown>
        </Menu.Sub>
        <Menu.Divider />
        <Menu.Item>
          Save
          <template #rightSection><Text size="xs" c="dimmed">⌘S</Text></template>
        </Menu.Item>
        <Menu.Item>Save as…</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>Edit</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>
          Undo
          <template #rightSection><Text size="xs" c="dimmed">⌘Z</Text></template>
        </Menu.Item>
        <Menu.Item>
          Redo
          <template #rightSection><Text size="xs" c="dimmed">⌘⇧Z</Text></template>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>Cut</Menu.Item>
        <Menu.Item>Copy</Menu.Item>
        <Menu.Item>Paste</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>Help</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>Documentation</Menu.Item>
        <Menu.Item>Keyboard shortcuts</Menu.Item>
        <Menu.Item>About</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>
  </Menubar>
</template>
`

const shortcut = (label: string) => h(Text, { size: 'xs', c: 'dimmed' }, () => label)

const Demo = defineComponent({
  name: 'MenubarUsageDemo',
  setup() {
    return () =>
      h(Menubar, null, () => [
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'File'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, { rightSection: shortcut('⌘N') }, () => 'New file'),
            h(Menu.Item, { rightSection: shortcut('⌘⇧N') }, () => 'New window'),
            h(Menu.Sub, null, () => [
              h(Menu.Sub.Target, null, () => h(Menu.Sub.Item, null, () => 'Open recent')),
              h(Menu.Sub.Dropdown, null, () => [
                h(Menu.Item, null, () => 'project-alpha'),
                h(Menu.Item, null, () => 'project-beta'),
                h(Menu.Item, null, () => 'project-gamma'),
              ]),
            ]),
            h(Menu.Divider),
            h(Menu.Item, { rightSection: shortcut('⌘S') }, () => 'Save'),
            h(Menu.Item, null, () => 'Save as…'),
          ]),
        ]),
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'Edit'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, { rightSection: shortcut('⌘Z') }, () => 'Undo'),
            h(Menu.Item, { rightSection: shortcut('⌘⇧Z') }, () => 'Redo'),
            h(Menu.Divider),
            h(Menu.Item, null, () => 'Cut'),
            h(Menu.Item, null, () => 'Copy'),
            h(Menu.Item, null, () => 'Paste'),
          ]),
        ]),
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'Help'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, null, () => 'Documentation'),
            h(Menu.Item, null, () => 'Keyboard shortcuts'),
            h(Menu.Item, null, () => 'About'),
          ]),
        ]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
