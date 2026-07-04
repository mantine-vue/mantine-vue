import { defineComponent, h } from 'vue'
import { Checkbox, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Checkbox } from '@mantine-vue/core'
</script>

<template>
  <div>
    <Tooltip label="Checkbox with tooltip">
      <Checkbox label="Tooltip on checkbox only" />
    </Tooltip>

    <Tooltip label="Checkbox with tooltip" refProp="rootRef">
      <Checkbox label="Tooltip the entire element" mt="md" />
    </Tooltip>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxTooltipDemo',
  setup: () => () =>
    h('div', null, [
      h(
        Tooltip,
        { label: 'Checkbox with tooltip' },
        {
          default: () => h(Checkbox, { label: 'Tooltip on checkbox only' }),
        },
      ),
      h(
        Tooltip,
        { label: 'Checkbox with tooltip', refProp: 'rootRef' },
        {
          default: () => h(Checkbox, { label: 'Tooltip the entire element', mt: 'md' }),
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
