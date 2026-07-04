import { defineComponent, h } from 'vue'
import { Radio, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Radio } from '@mantine-vue/core'
</script>

<template>
  <div>
    <Tooltip label="Radio with tooltip">
      <Radio label="Tooltip on radio only" />
    </Tooltip>

    <Tooltip label="Radio with tooltip" ref-prop="rootRef">
      <Radio label="Tooltip the entire element" mt="md" />
    </Tooltip>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'RadioTooltipDemo',
  setup: () => () =>
    h('div', null, [
      h(
        Tooltip,
        { label: 'Radio with tooltip' },
        {
          default: () => h(Radio, { label: 'Tooltip on radio only' }),
        },
      ),
      h(
        Tooltip,
        { label: 'Radio with tooltip', refProp: 'rootRef' },
        {
          default: () => h(Radio, { label: 'Tooltip the entire element', mt: 'md' }),
        },
      ),
    ]),
})

export const tooltip: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
