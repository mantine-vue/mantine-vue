import { defineComponent, h } from 'vue'
import {
  PhArrowsLeftRight,
  PhChatCircle,
  PhGearSix,
  PhImage,
  PhMagnifyingGlass,
  PhTrash,
} from '@phosphor-icons/vue'
import { Button, Menu, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import {
  PhGearSix, PhChatCircle, PhImage, PhMagnifyingGlass,
  PhArrowsLeftRight, PhTrash,
} from '@phosphor-icons/vue'
import { Button, Menu, Text } from '@mantine-vue/core'
</script>

<template>
  <Menu shadow="md" :width="200" position="bottom-end">
    <Menu.Target>
      <Button>Toggle menu</Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>Application</Menu.Label>
      <Menu.Item :left-section="h(PhGearSix, { size: 14 })">Settings</Menu.Item>
      <Menu.Item :left-section="h(PhChatCircle, { size: 14 })">Messages</Menu.Item>
      <Menu.Item :left-section="h(PhImage, { size: 14 })">Gallery</Menu.Item>
      <Menu.Item
        :left-section="h(PhMagnifyingGlass, { size: 14 })"
        :right-section="h(Text, { size: 'xs', c: 'dimmed' }, () => '⌘K')"
      >
        Search
      </Menu.Item>
      <Menu.Divider />
      <Menu.Label>Danger zone</Menu.Label>
      <Menu.Item :left-section="h(PhArrowsLeftRight, { size: 14 })">Transfer my data</Menu.Item>
      <Menu.Item color="red" :left-section="h(PhTrash, { size: 14 })">Delete my account</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuPositionConfiguratorDemo',
  inheritAttrs: false,
  props: {
    position: { type: String, default: 'bottom-end' },
  },
  setup(props) {
    return () =>
      h(
        Menu,
        { shadow: 'md', width: 200, position: (props as any).position },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Label, null, () => 'Application'),
                h(Menu.Item, { leftSection: h(PhGearSix, { size: 14 }) }, () => 'Settings'),
                h(Menu.Item, { leftSection: h(PhChatCircle, { size: 14 }) }, () => 'Messages'),
                h(Menu.Item, { leftSection: h(PhImage, { size: 14 }) }, () => 'Gallery'),
                h(
                  Menu.Item,
                  {
                    leftSection: h(PhMagnifyingGlass, { size: 14 }),
                    rightSection: h(Text, { size: 'xs', c: 'dimmed' }, () => '⌘K'),
                  },
                  () => 'Search',
                ),
                h(Menu.Divider),
                h(Menu.Label, null, () => 'Danger zone'),
                h(
                  Menu.Item,
                  { leftSection: h(PhArrowsLeftRight, { size: 14 }) },
                  () => 'Transfer my data',
                ),
                h(
                  Menu.Item,
                  { color: 'red', leftSection: h(PhTrash, { size: 14 }) },
                  () => 'Delete my account',
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const positionConfigurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  controls: [
    {
      type: 'select',
      prop: 'position',
      initialValue: 'bottom-end',
      libraryValue: 'bottom',
      data: [
        { label: 'bottom', value: 'bottom' },
        { label: 'bottom-start', value: 'bottom-start' },
        { label: 'bottom-end', value: 'bottom-end' },
        { label: 'top', value: 'top' },
        { label: 'top-start', value: 'top-start' },
        { label: 'top-end', value: 'top-end' },
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
      ],
    },
  ],
  centered: true,
}
