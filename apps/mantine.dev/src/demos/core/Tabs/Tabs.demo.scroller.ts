import { defineComponent, h } from 'vue'
import { Scroller, Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="tab-1">
    <Tabs.List>
      <Scroller>
        <Tabs.Tab value="tab-1">First tab</Tabs.Tab>
        <Tabs.Tab value="tab-2">Second tab</Tabs.Tab>
        <Tabs.Tab value="tab-3">Third tab</Tabs.Tab>
        <Tabs.Tab value="tab-4">Fourth tab</Tabs.Tab>
        <Tabs.Tab value="tab-5">Fifth tab</Tabs.Tab>
        <Tabs.Tab value="tab-6">Sixth tab</Tabs.Tab>
        <Tabs.Tab value="tab-7">Seventh tab</Tabs.Tab>
        <Tabs.Tab value="tab-8">Eighth tab</Tabs.Tab>
        <Tabs.Tab value="tab-9">Ninth tab</Tabs.Tab>
        <Tabs.Tab value="tab-10">Tenth tab</Tabs.Tab>
      </Scroller>
    </Tabs.List>
  </Tabs>
</template>

<script setup lang="ts">
import { Scroller, Tabs } from '@mantine-vue/core'
</script>
`

const tabLabels = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
  'Tenth',
]

const Demo = defineComponent({
  name: 'TabsScrollerDemo',
  setup() {
    return () =>
      h(
        Tabs,
        { defaultValue: 'tab-1' },
        {
          default: () =>
            h(
              Tabs.List,
              {},
              {
                default: () =>
                  h(
                    Scroller,
                    {},
                    {
                      default: () =>
                        tabLabels.map((label, i) =>
                          h(
                            Tabs.Tab,
                            { key: `tab-${i + 1}`, value: `tab-${i + 1}` },
                            { default: () => `${label} tab` },
                          ),
                        ),
                    },
                  ),
              },
            ),
        },
      )
  },
})

export const scroller: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 500,
  centered: true,
}
