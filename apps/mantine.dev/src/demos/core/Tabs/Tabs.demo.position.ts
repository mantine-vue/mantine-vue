import { defineComponent, h } from 'vue'
import { Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Tabs default-value="first">
    <Tabs.List{{props}}>
      <Tabs.Tab value="first">First tab</Tabs.Tab>
      <Tabs.Tab value="second">Second tab</Tabs.Tab>
      <Tabs.Tab value="third">Third tab</Tabs.Tab>
    </Tabs.List>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs } from '@mantine-vue/core'
</script>
`

const Demo = defineComponent({
  name: 'TabsPositionDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        Tabs,
        { defaultValue: 'first' },
        {
          default: () =>
            h(
              Tabs.List,
              { ...(attrs as any) },
              {
                default: () => [
                  h(Tabs.Tab, { value: 'first' }, { default: () => 'First tab' }),
                  h(Tabs.Tab, { value: 'second' }, { default: () => 'Second tab' }),
                  h(Tabs.Tab, { value: 'third' }, { default: () => 'Third tab' }),
                ],
              },
            ),
        },
      )
  },
})

export const position: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    { prop: 'grow', type: 'boolean', initialValue: false, libraryValue: false },
    {
      prop: 'justify',
      type: 'select',
      initialValue: 'flex-start',
      libraryValue: 'flex-start',
      data: ['flex-start', 'center', 'flex-end', 'space-between'],
    },
  ],
}
