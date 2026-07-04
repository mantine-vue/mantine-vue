import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import { FLOATING_POSITION_DATA } from '@/demos/shared/variants-data'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Tooltip" :opened="true"{{props}}>
    <Button>Button with tooltip</Button>
  </Tooltip>
</template>
`

const Wrapper = defineComponent({
  name: 'TooltipOffsetDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Tooltip,
        { label: 'Tooltip', opened: true, ...(attrs as any) },
        {
          default: () => h(Button, null, () => 'Button with tooltip'),
        },
      )
  },
})

export const offset: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    {
      type: 'select',
      prop: 'position',
      initialValue: 'top',
      data: FLOATING_POSITION_DATA,
      libraryValue: null as any,
    },
    {
      type: 'number',
      prop: 'offset',
      initialValue: 5,
      libraryValue: null as any,
      min: -50,
      max: 50,
    },
  ],
}
