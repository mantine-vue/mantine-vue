import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="chat" allow-tab-deactivation>
    <!-- ...content -->
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsDeactivateDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { defaultValue: 'chat', allowTabDeactivation: true },
        {
          default: () => [
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
            h(Tabs.Panel, { value: 'chat', pt: 'xs' }, { default: () => 'Chat panel' }),
            h(Tabs.Panel, { value: 'gallery', pt: 'xs' }, { default: () => 'Gallery panel' }),
            h(Tabs.Panel, { value: 'account', pt: 'xs' }, { default: () => 'Account panel' }),
          ],
        },
      )
  },
})

export const deactivate: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
