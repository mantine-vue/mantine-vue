import { defineComponent, h } from 'vue'
import { Button, Group, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Tooltip, Button, Group } from '@mantine-vue/core'
</script>

<template>
  <Tooltip.Group :open-delay="500" :close-delay="100">
    <Group justify="center">
      <Tooltip label="Tooltip 1">
        <Button>Button 1</Button>
      </Tooltip>
      <Tooltip label="Tooltip 2">
        <Button>Button 2</Button>
      </Tooltip>
      <Tooltip label="Tooltip 3">
        <Button>Button 3</Button>
      </Tooltip>
    </Group>
  </Tooltip.Group>
</template>
`

const Demo = defineComponent({
  name: 'TooltipGroupDemo',
  setup() {
    return () =>
      h(
        Tooltip.Group,
        { openDelay: 500, closeDelay: 100 },
        {
          default: () =>
            h(
              Group,
              { justify: 'center' },
              {
                default: () => [
                  h(
                    Tooltip,
                    { label: 'Tooltip 1' },
                    { default: () => h(Button, null, () => 'Button 1') },
                  ),
                  h(
                    Tooltip,
                    { label: 'Tooltip 2' },
                    { default: () => h(Button, null, () => 'Button 2') },
                  ),
                  h(
                    Tooltip,
                    { label: 'Tooltip 3' },
                    { default: () => h(Button, null, () => 'Button 3') },
                  ),
                ],
              },
            ),
        },
      )
  },
})

export const group: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
