import { defineComponent, h } from 'vue'
import { Menu, Menubar } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Menu, Menubar } from '@mantine-vue/core'
</script>

<template>
  <Menubar{{props}}>
    <Menubar.Menu :width="220">
      <Menubar.Target>File</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>New file</Menu.Item>
        <Menu.Item>Save</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>Edit</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>Undo</Menu.Item>
        <Menu.Item>Redo</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>
  </Menubar>
</template>
`

const Demo = defineComponent({
  name: 'MenubarStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Menubar, { ...attrs }, () => [
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'File'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, null, () => 'New file'),
            h(Menu.Item, null, () => 'Save'),
          ]),
        ]),
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'Edit'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, null, () => 'Undo'),
            h(Menu.Item, null, () => 'Redo'),
          ]),
        ]),
      ])
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      target: '`Menubar.Target` button',
    },
  },
  component: Demo,
  code,
  centered: true,
}
