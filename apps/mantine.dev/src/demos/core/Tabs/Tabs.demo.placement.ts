import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="gallery" orientation="vertical"{{props}}>
    <Tabs.List>
      <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
      <Tabs.Tab value="messages">Messages</Tabs.Tab>
      <Tabs.Tab value="settings">Settings</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="gallery" pl="xs">Gallery tab content</Tabs.Panel>
    <Tabs.Panel value="messages" pl="xs">Messages tab content</Tabs.Panel>
    <Tabs.Panel value="settings" pl="xs">Settings tab content</Tabs.Panel>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsPlacementDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const isRight = () => (attrs as any).placement === 'right'
    return () => {
      const panelProps = isRight() ? { pr: 'xs' } : { pl: 'xs' }
      return h(
        Tabs,
        { defaultValue: 'gallery', orientation: 'vertical', ...(attrs as any) },
        {
          default: () => [
            h(
              Tabs.List,
              {},
              {
                default: () => [
                  h(Tabs.Tab, { value: 'gallery' }, { default: () => 'Gallery' }),
                  h(Tabs.Tab, { value: 'messages' }, { default: () => 'Messages' }),
                  h(Tabs.Tab, { value: 'settings' }, { default: () => 'Settings' }),
                ],
              },
            ),
            h(
              Tabs.Panel,
              { value: 'gallery', ...panelProps },
              { default: () => 'Gallery tab content' },
            ),
            h(
              Tabs.Panel,
              { value: 'messages', ...panelProps },
              { default: () => 'Messages tab content' },
            ),
            h(
              Tabs.Panel,
              { value: 'settings', ...panelProps },
              { default: () => 'Settings tab content' },
            ),
          ],
        },
      )
    }
  },
})

export const placement: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  controls: [
    {
      prop: 'placement',
      type: 'segmented',
      initialValue: 'left',
      libraryValue: 'left',
      data: ['left', 'right'],
    },
  ],
}
