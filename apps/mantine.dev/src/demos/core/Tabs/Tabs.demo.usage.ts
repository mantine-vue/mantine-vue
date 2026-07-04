import { defineComponent, h } from 'vue'
import { PhImage, PhChatCircle, PhGear } from '@phosphor-icons/vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs{{props}} default-value="gallery">
    <Tabs.List>
      <Tabs.Tab value="gallery" :left-section="() => h(PhImage, { size: 12 })">Gallery</Tabs.Tab>
      <Tabs.Tab value="messages" :left-section="() => h(PhChatCircle, { size: 12 })">Messages</Tabs.Tab>
      <Tabs.Tab value="settings" :left-section="() => h(PhGear, { size: 12 })">Settings</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="gallery" pt="xs">Gallery tab content</Tabs.Panel>
    <Tabs.Panel value="messages" pt="xs">Messages tab content</Tabs.Panel>
    <Tabs.Panel value="settings" pt="xs">Settings tab content</Tabs.Panel>
  </Tabs>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import { PhImage, PhChatCircle, PhGear } from '@phosphor-icons/vue'
</script>
`

const Demo = defineComponent({
  name: 'TabsUsageDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const isVertical = () => (attrs as any).orientation === 'vertical'
    return () => {
      const panelProps = isVertical() ? { pl: 'xs' } : { pt: 'xs' }
      return h(
        Tabs,
        { defaultValue: 'gallery', ...(attrs as any) },
        {
          default: () => [
            h(
              Tabs.List,
              {},
              {
                default: () => [
                  h(
                    Tabs.Tab,
                    { value: 'gallery', leftSection: () => h(PhImage, { size: 12 }) },
                    { default: () => 'Gallery' },
                  ),
                  h(
                    Tabs.Tab,
                    { value: 'messages', leftSection: () => h(PhChatCircle, { size: 12 }) },
                    { default: () => 'Messages' },
                  ),
                  h(
                    Tabs.Tab,
                    { value: 'settings', leftSection: () => h(PhGear, { size: 12 }) },
                    { default: () => 'Settings' },
                  ),
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

export const usage: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    {
      prop: 'variant',
      type: 'segmented',
      initialValue: 'default',
      libraryValue: 'default',
      data: ['default', 'outline', 'pills'],
    },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    {
      prop: 'orientation',
      type: 'segmented',
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
      data: ['horizontal', 'vertical'],
    },
  ],
}
