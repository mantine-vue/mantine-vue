import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Button is disabled">
    <Button data-disabled @click.prevent>
      Disabled with tooltip
    </Button>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'ButtonDisabledTooltipDemo',
  setup: () => () =>
    h(
      Tooltip,
      { label: 'Button is disabled' },
      {
        default: () =>
          h(
            Button,
            { 'data-disabled': true, onClick: (e: Event) => e.preventDefault() },
            { default: () => 'Disabled with tooltip' },
          ),
      },
    ),
})

export const disabledTooltip: MantineDemo = { type: 'code', component: Demo, code, centered: true }
