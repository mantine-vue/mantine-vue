import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="chat" inverted>
    <Tabs.Panel value="chat" pb="xs">Chat panel</Tabs.Panel>
    <Tabs.Panel value="gallery" pb="xs">Gallery panel</Tabs.Panel>
    <Tabs.Panel value="account" pb="xs">Account panel</Tabs.Panel>

    <Tabs.List>
      <Tabs.Tab value="chat">Chat</Tabs.Tab>
      <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
      <Tabs.Tab value="account">Account</Tabs.Tab>
    </Tabs.List>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsInvertedDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { defaultValue: 'chat', inverted: true },
        {
          default: () => [
            h(Tabs.Panel, { value: 'chat', pb: 'xs' }, { default: () => 'Chat panel' }),
            h(Tabs.Panel, { value: 'gallery', pb: 'xs' }, { default: () => 'Gallery panel' }),
            h(Tabs.Panel, { value: 'account', pb: 'xs' }, { default: () => 'Account panel' }),
            h(
              Tabs.List,
              {},
              {
                default: () => [
                  h(Tabs.Tab, { value: 'chat' }, { default: () => 'Chat' }),
                  h(Tabs.Tab, { value: 'gallery' }, { default: () => 'Gallery' }),
                  h(Tabs.Tab, { value: 'account' }, { default: () => 'Account' }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const inverted: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
