import { defineComponent, h, ref } from 'vue'
import { Button, Group, Menu, Menubar, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Menu, Menubar, Stack } from '@mantine-vue/core'

const openIndex = ref<number | null>(null)
</script>

<template>
  <Stack>
    <Group>
      <Button variant="default" @click="openIndex = 0">Open File</Button>
      <Button variant="default" @click="openIndex = 1">Open Edit</Button>
      <Button variant="default" @click="openIndex = null">Close all</Button>
    </Group>

    <Menubar :open-index="openIndex" @open-change="openIndex = $event">
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
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'MenubarControlledDemo',
  setup() {
    const openIndex = ref<number | null>(null)
    return () =>
      h(Stack, null, () => [
        h(Group, null, () => [
          h(
            Button,
            { variant: 'default', onClick: () => (openIndex.value = 0) },
            () => 'Open File',
          ),
          h(
            Button,
            { variant: 'default', onClick: () => (openIndex.value = 1) },
            () => 'Open Edit',
          ),
          h(
            Button,
            { variant: 'default', onClick: () => (openIndex.value = null) },
            () => 'Close all',
          ),
        ]),
        h(
          Menubar,
          {
            openIndex: openIndex.value,
            onOpenChange: (value: number | null) => {
              openIndex.value = value
            },
          },
          () => [
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
          ],
        ),
      ])
  },
})

export const controlled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
