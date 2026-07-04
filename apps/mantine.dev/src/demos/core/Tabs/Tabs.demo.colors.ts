import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs color="teal" default-value="first">
    <Tabs.List>
      <Tabs.Tab value="first">Teal tab</Tabs.Tab>
      <Tabs.Tab value="second" color="blue">Blue tab</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="first" pt="xs">
      First tab color is teal, it gets this value from context
    </Tabs.Panel>
    <Tabs.Panel value="second" pt="xs">
      Second tab color is blue, it gets this value from props, props have the priority and will
      override context value
    </Tabs.Panel>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsColorsDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { color: 'teal', defaultValue: 'first' },
        {
          default: () => [
            h(
              Tabs.List,
              {},
              {
                default: () => [
                  h(Tabs.Tab, { value: 'first' }, { default: () => 'Teal tab' }),
                  h(Tabs.Tab, { value: 'second', color: 'blue' }, { default: () => 'Blue tab' }),
                ],
              },
            ),
            h(
              Tabs.Panel,
              { value: 'first', pt: 'xs' },
              {
                default: () => 'First tab color is teal, it gets this value from context',
              },
            ),
            h(
              Tabs.Panel,
              { value: 'second', pt: 'xs' },
              {
                default: () =>
                  'Second tab color is blue, it gets this value from props, props have the priority and will override context value',
              },
            ),
          ],
        },
      )
  },
})

export const colors: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
