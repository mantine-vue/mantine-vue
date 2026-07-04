import { defineComponent, h } from 'vue'
import { PhGearSix, PhSignOut, PhUser } from '@phosphor-icons/vue'
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { PhUser, PhGearSix, PhLogOut } from '@phosphor-icons/vue'
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine-vue/core'
</script>

<template>
  <Menu :width="200" shadow="md">
    <Menu.Target>
      <UnstyledButton>
        <Group>
          <Avatar
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
            radius="xl"
          />
          <div style="flex: 1">
            <Text size="sm" fw={500}>Harriette Spoonlicker</Text>
            <Text c="dimmed" size="xs">hspoonlicker@outlook.com</Text>
          </div>
        </Group>
      </UnstyledButton>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item :left-section="h(PhUser, { size: 14 })">Your profile</Menu.Item>
      <Menu.Item :left-section="h(PhGearSix, { size: 14 })">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item color="red" :left-section="h(PhLogOut, { size: 14 })">Logout</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuCustomControlDemo',
  setup() {
    return () =>
      h(
        Menu,
        { width: 200, shadow: 'md' },
        {
          default: () => [
            h(Menu.Target, null, {
              default: () =>
                h(UnstyledButton, null, {
                  default: () =>
                    h(Group, null, {
                      default: () => [
                        h(Avatar, {
                          src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
                          radius: 'xl',
                        }),
                        h('div', { style: 'flex: 1' }, [
                          h(Text, { size: 'sm', fw: 500 }, () => 'Harriette Spoonlicker'),
                          h(Text, { c: 'dimmed', size: 'xs' }, () => 'hspoonlicker@outlook.com'),
                        ]),
                      ],
                    }),
                }),
            }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Item, { leftSection: h(PhUser, { size: 14 }) }, () => 'Your profile'),
                h(Menu.Item, { leftSection: h(PhGearSix, { size: 14 }) }, () => 'Settings'),
                h(Menu.Divider),
                h(
                  Menu.Item,
                  { color: 'red', leftSection: h(PhSignOut, { size: 14 }) },
                  () => 'Logout',
                ),
              ],
            }),
          ],
        },
      )
  },
})

export const customControl: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
