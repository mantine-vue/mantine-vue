import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Text, Button } from '@mantine-vue/core'
</script>

<template>
  <Popover width="target" position="bottom" with-arrow shadow="md">
    <Popover.Target>
      <Button :w="280">Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="sm">
        This popover has same width as target, it is useful when you are building input dropdowns
      </Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverSameWidthDemo',
  setup() {
    return () =>
      h(
        Popover,
        { width: 'target', position: 'bottom', withArrow: true, shadow: 'md' },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, { w: 280 }, () => 'Toggle popover'),
            }),
            h(Popover.Dropdown, null, {
              default: () =>
                h(
                  Text,
                  { size: 'sm' },
                  () =>
                    'This popover has same width as target, it is useful when you are building input dropdowns',
                ),
            }),
          ],
        },
      )
  },
})

export const sameWidth: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
