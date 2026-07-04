import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Button, Text } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="200" :opened="true" position="bottom-start" with-arrow{{props}}>
    <Popover.Target>
      <Button>Target element</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="xs">Arrow position can be changed for *-start and *-end positions</Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Wrapper = defineComponent({
  name: 'PopoverArrowDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Popover,
        { width: 200, opened: true, position: 'bottom-start', withArrow: true, ...(attrs as any) },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, null, () => 'Target element'),
            }),
            h(Popover.Dropdown, null, {
              default: () =>
                h(
                  Text,
                  { size: 'xs' },
                  () => 'Arrow position can be changed for *-start and *-end positions',
                ),
            }),
          ],
        },
      )
  },
})

export const arrow: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'arrowPosition',
      initialValue: 'center',
      libraryValue: 'center',
      data: ['center', 'side'],
    },
    { type: 'number', prop: 'arrowOffset', initialValue: 10, libraryValue: 10, min: 5, max: 50 },
    { type: 'number', prop: 'arrowSize', initialValue: 7, libraryValue: 7, min: 5, max: 12 },
    { type: 'number', prop: 'arrowRadius', initialValue: 0, libraryValue: 0, min: 0, max: 10 },
  ],
}
