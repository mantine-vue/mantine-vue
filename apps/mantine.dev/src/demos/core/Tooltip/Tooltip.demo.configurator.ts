import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Tooltip"{{props}}>
    <Button>With tooltip</Button>
  </Tooltip>
</template>
`

const Wrapper = defineComponent({
  name: 'TooltipConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Tooltip,
        { label: 'Tooltip', ...(attrs as any) },
        {
          default: () => h(Button, null, () => 'With tooltip'),
        },
      )
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: '__none__' as any },
  ],
}
