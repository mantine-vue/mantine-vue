import { defineComponent, h } from 'vue'
import { Button, Popover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Text, Button } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="200"{{props}}>
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Text size="xs">Disabled popover dropdown is always hidden</Text>
    </Popover.Dropdown>
  </Popover>
</template>
`

const Wrapper = defineComponent({
  name: 'PopoverDisabledDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Popover,
        { width: 200, ...(attrs as any) },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, null, () => 'Toggle popover'),
            }),
            h(Popover.Dropdown, null, {
              default: () =>
                h(Text, { size: 'xs' }, () => 'Disabled popover dropdown is always hidden'),
            }),
          ],
        },
      )
  },
})

export const disabled: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [{ type: 'boolean', prop: 'disabled', initialValue: false, libraryValue: false }],
}
