import { defineComponent, h } from 'vue'
import { Button, Group, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Tooltip, Group } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <Tooltip label="Opened after 500ms" :open-delay="500">
      <Button>Delay open - 500ms</Button>
    </Tooltip>
    <Tooltip label="Closes after 500ms" :close-delay="500">
      <Button>Delay close - 500ms</Button>
    </Tooltip>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'TooltipDelayDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              Tooltip,
              { label: 'Opened after 500ms', openDelay: 500 },
              {
                default: () => h(Button, null, () => 'Delay open - 500ms'),
              },
            ),
            h(
              Tooltip,
              { label: 'Closes after 500ms', closeDelay: 500 },
              {
                default: () => h(Button, null, () => 'Delay close - 500ms'),
              },
            ),
          ],
        },
      )
  },
})

export const delay: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
