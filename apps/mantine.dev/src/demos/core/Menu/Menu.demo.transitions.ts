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
    transition-props="{ transition: 'rotate-right', duration: 150 }"
  >
    <Menu.Target>
      <Button>Toggle menu</Button>
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
  name: 'MenuTransitionsDemo',
  inheritAttrs: false,
  props: {
    transition: { type: String, default: 'rotate-right' },
  },
  setup(props) {
    return () =>
      h(
        Menu,
        {
          shadow: 'md',
          width: 200,
          transitionProps: { transition: props.transition, duration: 150 },
        },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
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

export const transitions: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  controls: [
    {
      type: 'select',
      prop: 'transition',
      initialValue: 'rotate-right',
      libraryValue: undefined,
      data: [
        'rotate-right',
        'rotate-left',
        'skew-up',
        'skew-down',
        'scale-y',
        'slide-down',
        'pop',
        'fade',
      ],
    },
  ],
  centered: true,
}
