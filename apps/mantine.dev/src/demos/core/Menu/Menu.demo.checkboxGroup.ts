import { defineComponent, h, ref } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Menu } from '@mantine-vue/core'

const columns = ref(['name', 'email'])
</script>

<template>
  <Menu shadow="md" :width="220" :close-on-item-click="false">
    <Menu.Target>
      <Button>Columns</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Visible columns</Menu.Label>
      <Menu.CheckboxGroup :value="columns" @change="columns = $event">
        <Menu.CheckboxItem value="name">Name</Menu.CheckboxItem>
        <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
        <Menu.CheckboxItem value="role">Role</Menu.CheckboxItem>
        <Menu.CheckboxItem value="lastSeen">Last seen</Menu.CheckboxItem>
      </Menu.CheckboxGroup>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuCheckboxGroupDemo',
  setup() {
    const columns = ref(['name', 'email'])

    return () =>
      h(
        Menu,
        { shadow: 'md', width: 220, closeOnItemClick: false },
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
                      h(Menu.CheckboxItem, { value: 'role' }, () => 'Role'),
                      h(Menu.CheckboxItem, { value: 'lastSeen' }, () => 'Last seen'),
                    ],
                  },
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const checkboxGroup: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
