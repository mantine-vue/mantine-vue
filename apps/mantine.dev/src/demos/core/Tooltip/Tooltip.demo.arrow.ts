import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button } from '@mantine-vue/core'
</script>

<template>
  <Tooltip{{props}} label="Tooltip" with-arrow :opened="true" position="top-start">
    <Button>Button with tooltip</Button>
  </Tooltip>
</template>
`

const Wrapper = defineComponent({
  name: 'TooltipArrowDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Tooltip,
        {
          label: 'Tooltip',
          withArrow: true,
          opened: true,
          position: 'top-start',
          ...(attrs as any),
        },
        {
          default: () => h(Button, null, () => 'Button with tooltip'),
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
      data: ['center', 'side', 'merge'],
    },
    {
      type: 'number',
      prop: 'arrowOffset',
      initialValue: 10,
      libraryValue: null as any,
      min: 5,
      max: 50,
    },
    {
      type: 'number',
      prop: 'arrowSize',
      initialValue: 4,
      libraryValue: null as any,
      min: 2,
      max: 8,
    },
    { type: 'number', prop: 'arrowRadius', initialValue: 0, libraryValue: 0, min: 0, max: 10 },
  ],
}
