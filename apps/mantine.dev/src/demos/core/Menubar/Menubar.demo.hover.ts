import { defineComponent, h } from 'vue'
import { Menu, Menubar } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Menu, Menubar } from '@mantine-vue/core'
</script>

<template>
  <Menubar trigger="hover">
    <Menubar.Menu :width="220">
      <Menubar.Target>File</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>New file</Menu.Item>
        <Menu.Item>New window</Menu.Item>
        <Menu.Item>Save</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>Edit</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>Undo</Menu.Item>
        <Menu.Item>Redo</Menu.Item>
        <Menu.Item>Cut</Menu.Item>
        <Menu.Item>Copy</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>View</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>Zoom in</Menu.Item>
        <Menu.Item>Zoom out</Menu.Item>
        <Menu.Item>Reset zoom</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>
  </Menubar>
</template>
`

const menu = (label: string, items: string[]) =>
  h(Menubar.Menu, { width: 220 }, () => [
    h(Menubar.Target, null, () => label),
    h(Menubar.Dropdown, null, () => items.map((item) => h(Menu.Item, { key: item }, () => item))),
  ])

const Demo = defineComponent({
  name: 'MenubarHoverDemo',
  setup() {
    return () =>
      h(Menubar, { trigger: 'hover' }, () => [
        menu('File', ['New file', 'New window', 'Save']),
        menu('Edit', ['Undo', 'Redo', 'Cut', 'Copy']),
        menu('View', ['Zoom in', 'Zoom out', 'Reset zoom']),
      ])
  },
})

export const hover: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
