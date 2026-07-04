import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="chat">
    <Tabs.List>
      <Tabs.Tab value="chat">Chat</Tabs.Tab>
      <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
      <Tabs.Tab value="settings" disabled>Settings</Tabs.Tab>
      <Tabs.Tab value="account">Account</Tabs.Tab>
    </Tabs.List>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsDisabledDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { defaultValue: 'chat' },
        {
          default: () =>
            h(
              Tabs.List,
              {},
              {
                default: () => [
                  h(Tabs.Tab, { value: 'chat' }, { default: () => 'Chat' }),
                  h(Tabs.Tab, { value: 'gallery' }, { default: () => 'Gallery' }),
                  h(Tabs.Tab, { value: 'settings', disabled: true }, { default: () => 'Settings' }),
                  h(Tabs.Tab, { value: 'account' }, { default: () => 'Account' }),
                ],
              },
            ),
        },
      )
  },
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
