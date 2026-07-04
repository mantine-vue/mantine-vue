import { defineComponent, h, reactive } from 'vue'
import { Button, Menu } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { reactive } from 'vue'
import { Button, Menu } from '@mantine-vue/core'

const columns = reactive({ name: true, email: true, role: false, lastSeen: false })
</script>

<template>
  <Menu shadow="md" :width="220" :close-on-item-click="false">
    <Menu.Target>
      <Button>Columns</Button>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Visible columns</Menu.Label>
      <Menu.CheckboxItem :checked="columns.name" @change="(v) => columns.name = v">Name</Menu.CheckboxItem>
      <Menu.CheckboxItem :checked="columns.email" @change="(v) => columns.email = v">Email</Menu.CheckboxItem>
      <Menu.CheckboxItem :checked="columns.role" @change="(v) => columns.role = v">Role</Menu.CheckboxItem>
      <Menu.CheckboxItem :checked="columns.lastSeen" @change="(v) => columns.lastSeen = v">Last seen</Menu.CheckboxItem>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuCheckboxItemDemo',
  setup() {
    const columns = reactive({ name: true, email: true, role: false, lastSeen: false })

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
                  Menu.CheckboxItem,
                  {
                    checked: columns.name,
                    onChange: (v: boolean) => {
                      columns.name = v
                    },
                  },
                  () => 'Name',
                ),
                h(
                  Menu.CheckboxItem,
                  {
                    checked: columns.email,
                    onChange: (v: boolean) => {
                      columns.email = v
                    },
                  },
                  () => 'Email',
                ),
                h(
                  Menu.CheckboxItem,
                  {
                    checked: columns.role,
                    onChange: (v: boolean) => {
                      columns.role = v
                    },
                  },
                  () => 'Role',
                ),
                h(
                  Menu.CheckboxItem,
                  {
                    checked: columns.lastSeen,
                    onChange: (v: boolean) => {
                      columns.lastSeen = v
                    },
                  },
                  () => 'Last seen',
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const checkboxItem: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
