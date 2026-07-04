import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Text, Button } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="200" position="bottom" :click-outside-events="['mouseup', 'touchend']">
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="xs">Popover will be closed with mouseup and touchend events</Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverClickOutsideEventsDemo',
  setup() {
    return () =>
      h(
        Popover,
        { width: 200, position: 'bottom', clickOutsideEvents: ['mouseup', 'touchend'] },
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
                  () => 'Popover will be closed with mouseup and touchend events',
                ),
            }),
          ],
        },
      )
  },
})

export const clickOutsideEvents: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
