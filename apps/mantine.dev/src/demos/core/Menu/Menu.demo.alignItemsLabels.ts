import { defineComponent, h, ref } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Menu } from '@mantine-vue/core'

const columns = ref(['name', 'email'])
</script>

<template>
  <Menu
    shadow="md"
    :width="260"
    :close-on-item-click="false"
    align-items-labels="with-indicators"
  >
    <Menu.Target>
      <Button>Columns</Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>Visible columns</Menu.Label>
      <Menu.CheckboxGroup :value="columns" @change="columns = $event">
        <Menu.CheckboxItem value="name">Name</Menu.CheckboxItem>
        <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
      </Menu.CheckboxGroup>
      <Menu.Divider />
      <Menu.Item>Settings</Menu.Item>
      <Menu.Item>Transfer data</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuAlignItemsLabelsDemo',
  inheritAttrs: false,
  props: {
    alignItemsLabels: { type: String, default: 'with-indicators' },
  },
  setup(props) {
    const columns = ref(['name', 'email'])

    return () =>
      h(
        Menu,
        {
          shadow: 'md',
          width: 260,
          closeOnItemClick: false,
          alignItemsLabels: (props as any).alignItemsLabels,
        },
        {
          default: () => [
            h(Menu.Target, null, { default: () => h(Button, null, () => 'Columns') }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Label, null, () => 'Visible columns'),
                h(
                  Menu.CheckboxGroup,
                  {
                    value: columns.value,
                    onChange: (v: string[]) => {
                      columns.value = v
                    },
                  },
                  {
                    default: () => [
                      h(Menu.CheckboxItem, { value: 'name' }, () => 'Name'),
                      h(Menu.CheckboxItem, { value: 'email' }, () => 'Email'),
                    ],
                  },
                ),
                h(Menu.Divider),
                h(Menu.Item, null, () => 'Settings'),
                h(Menu.Item, null, () => 'Transfer data'),
              ],
            }),
          ],
        },
      )
  },
})

export const alignItemsLabels: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  controls: [
    {
      type: 'select',
      prop: 'alignItemsLabels',
      initialValue: 'with-indicators',
      libraryValue: 'with-indicators',
      data: [
        { label: 'with-indicators', value: 'with-indicators' },
        { label: 'all', value: 'all' },
        { label: 'none', value: 'none' },
      ],
    },
  ],
  centered: true,
}
