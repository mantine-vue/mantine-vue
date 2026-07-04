import { defineComponent, h } from 'vue'
import { Switch, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip label="Switch tooltip" ref-prop="rootRef">
    <Switch label="Switch with tooltip" />
  </Tooltip>
</template>
`

const Demo = defineComponent({
  name: 'SwitchTooltipDemo',
  setup: () => () =>
    h(Tooltip, { label: 'Switch tooltip', refProp: 'rootRef' }, () =>
      h(Switch, { label: 'Switch with tooltip' }),
    ),
})

export const tooltip: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
