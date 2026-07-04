import { defineComponent, h } from 'vue'
import { Box, Menu, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Box, Menu, Text } from '@mantine-vue/core'
</script>

<template>
  <Menu shadow="md" :width="200">
    <Menu.ContextMenu>
      <Box
        style="height: 120px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--mantine-color-default-border); border-radius: var(--mantine-radius-md); cursor: default; user-select: none;"
      >
        <Text size="sm" c="dimmed">Right-click to open context menu</Text>
      </Box>
    </Menu.ContextMenu>

    <Menu.Dropdown>
      <Menu.Item>Copy</Menu.Item>
      <Menu.Item>Paste</Menu.Item>
      <Menu.Divider />
      <Menu.Item>Select all</Menu.Item>
      <Menu.Item color="red">Delete</Menu.Item>
    </Menu.Dropdown>
  </Menu>
</template>
`

const Demo = defineComponent({
  name: 'MenuContextMenuDemo',
  setup() {
    return () =>
      h(
        Menu,
        { shadow: 'md', width: 200 },
        {
          default: () => [
            h(Menu.ContextMenu, null, {
              default: () =>
                h(
                  Box,
                  {
                    style: {
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed var(--mantine-color-default-border)',
                      borderRadius: 'var(--mantine-radius-md)',
                      cursor: 'default',
                      userSelect: 'none',
                    },
                  },
                  {
                    default: () =>
                      h(
                        Text,
                        { size: 'sm', c: 'dimmed' },
                        () => 'Right-click to open context menu',
                      ),
                  },
                ),
            }),
            h(Menu.Dropdown, null, {
              default: () => [
                h(Menu.Item, null, () => 'Copy'),
                h(Menu.Item, null, () => 'Paste'),
                h(Menu.Divider),
                h(Menu.Item, null, () => 'Select all'),
                h(Menu.Item, { color: 'red' }, () => 'Delete'),
              ],
            }),
          ],
        },
      )
  },
})

export const contextMenu: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
