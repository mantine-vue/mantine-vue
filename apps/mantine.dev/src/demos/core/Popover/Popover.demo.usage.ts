import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Text, Button } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="200" position="bottom" with-arrow shadow="md">
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="xs">This is uncontrolled popover, it is opened when button is clicked</Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverUsageDemo',
  setup() {
    return () =>
      h(
        Popover,
        { width: 200, position: 'bottom', withArrow: true, shadow: 'md' },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, null, () => 'Toggle popover'),
            }),
            h(Popover.Dropdown, null, {
              default: () =>
                h(
                  Text,
                  { size: 'xs' },
                  () => 'This is uncontrolled popover, it is opened when button is clicked',
                ),
            }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
