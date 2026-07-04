import { defineComponent, h } from 'vue'
import { Chip, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Chip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Chip tooltip" refProp="rootRef">
    <Chip defaultChecked>Chip with tooltip</Chip>
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'ChipTooltipDemo',
  setup: () => () =>
    h(
      Tooltip,
      { label: 'Chip tooltip', refProp: 'rootRef' },
      {
        default: () => h(Chip, { defaultChecked: true }, { default: () => 'Chip with tooltip' }),
      },
    ),
})

export const tooltip: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
