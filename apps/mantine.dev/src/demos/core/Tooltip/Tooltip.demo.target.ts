import { defineComponent, h } from 'vue'
import { Button, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Tooltip } from '@mantine-vue/core'
</script>

<template>
  <Tooltip target="#hover-me" label="Tooltip over button" />
  <Button id="hover-me">Hover me to see tooltip</Button>
</template>
`

const Demo = defineComponent({
  name: 'TooltipTargetDemo',
  setup() {
    return () =>
      h('div', null, [
        h(Tooltip, { target: '#hover-me', label: 'Tooltip over button' }),
        h(Button, { id: 'hover-me' }, () => 'Hover me to see tooltip'),
      ])
  },
})

export const target: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
