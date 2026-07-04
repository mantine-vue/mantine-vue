import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Tooltip">
    <Button>Button with tooltip</Button>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'TooltipUsageDemo',
  setup() {
    return () =>
      h(
        Tooltip,
        { label: 'Tooltip' },
        {
          default: () => h(Button, null, () => 'Button with tooltip'),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
