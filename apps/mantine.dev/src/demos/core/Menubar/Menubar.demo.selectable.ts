import { defineComponent, h } from 'vue'
import { Menu, Menubar } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Menu, Menubar } from '@mantine-vue/core'
</script>

<template>
  <Menubar>
    <Menubar.Menu :width="220">
      <Menubar.Target>View</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.CheckboxItem default-checked>Show sidebar</Menu.CheckboxItem>
        <Menu.CheckboxItem>Show status bar</Menu.CheckboxItem>
        <Menu.Divider />
        <Menu.Label>Appearance</Menu.Label>
        <Menu.RadioGroup default-value="comfortable">
          <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
          <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
          <Menu.RadioItem value="spacious">Spacious</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menubar.Dropdown>
    </Menubar.Menu>

    <Menubar.Menu :width="220">
      <Menubar.Target>Window</Menubar.Target>
      <Menubar.Dropdown>
        <Menu.Item>Minimize</Menu.Item>
        <Menu.Item>Zoom</Menu.Item>
        <Menu.Item>Bring all to front</Menu.Item>
      </Menubar.Dropdown>
    </Menubar.Menu>
  </Menubar>
</template>
`

const Demo = defineComponent({
  name: 'MenubarSelectableDemo',
  setup() {
    return () =>
      h(Menubar, null, () => [
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'View'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.CheckboxItem, { defaultChecked: true }, () => 'Show sidebar'),
            h(Menu.CheckboxItem, null, () => 'Show status bar'),
            h(Menu.Divider),
            h(Menu.Label, null, () => 'Appearance'),
            h(Menu.RadioGroup, { defaultValue: 'comfortable' }, () => [
              h(Menu.RadioItem, { value: 'compact' }, () => 'Compact'),
              h(Menu.RadioItem, { value: 'comfortable' }, () => 'Comfortable'),
              h(Menu.RadioItem, { value: 'spacious' }, () => 'Spacious'),
            ]),
          ]),
        ]),
        h(Menubar.Menu, { width: 220 }, () => [
          h(Menubar.Target, null, () => 'Window'),
          h(Menubar.Dropdown, null, () => [
            h(Menu.Item, null, () => 'Minimize'),
            h(Menu.Item, null, () => 'Zoom'),
            h(Menu.Item, null, () => 'Bring all to front'),
          ]),
        ]),
      ])
  },
})

export const selectable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
