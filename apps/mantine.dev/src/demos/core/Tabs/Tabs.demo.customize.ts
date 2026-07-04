import { defineComponent, h } from 'vue'
import { PhGear, PhChatCircle, PhImage } from '@phosphor-icons/vue'
import { Tabs } from '@mantine-vue/core'
import classes from './Tabs.demo.customize.module.css'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs unstyled default-value="settings" :class-names="$style">
    <Tabs.List grow>
      <Tabs.Tab value="settings" :left-section="() => h(PhGear, { size: 16 })">Settings</Tabs.Tab>
      <Tabs.Tab value="messages" :left-section="() => h(PhChatCircle, { size: 16 })">Messages</Tabs.Tab>
      <Tabs.Tab value="gallery" :left-section="() => h(PhImage, { size: 16 })">Gallery</Tabs.Tab>
    </Tabs.List>
  </Tabs>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import { PhGear, PhChatCircle, PhImage } from '@phosphor-icons/vue'
</script>

<style module>
.tab {
  position: relative;
  border: 1px solid var(--mantine-color-default-border);
  background-color: var(--mantine-color-body);
}
.tab:first-of-type { border-radius: 4px 0 0 4px; }
.tab:last-of-type { border-radius: 0 4px 4px 0; }
.tab + .tab { border-left-width: 0; }
.tab:hover { background-color: var(--mantine-color-default-hover); }
.tab[data-active] {
  z-index: 1;
  background-color: var(--mantine-color-blue-filled);
  border-color: var(--mantine-color-blue-filled);
  color: var(--mantine-color-white);
}
.tab[data-active]:hover { background-color: var(--mantine-color-blue-filled-hover); }
</style>
`

const Demo = defineComponent({
  name: 'TabsCustomizeDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { unstyled: true, defaultValue: 'settings', classNames: classes },
        {
          default: () =>
            h(
              Tabs.List,
              { grow: true },
              {
                default: () => [
                  h(
                    Tabs.Tab,
                    { value: 'settings', leftSection: () => h(PhGear, { size: 16 }) },
                    { default: () => 'Settings' },
                  ),
                  h(
                    Tabs.Tab,
                    { value: 'messages', leftSection: () => h(PhChatCircle, { size: 16 }) },
                    { default: () => 'Messages' },
                  ),
                  h(
                    Tabs.Tab,
                    { value: 'gallery', leftSection: () => h(PhImage, { size: 16 }) },
                    { default: () => 'Gallery' },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const customize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
