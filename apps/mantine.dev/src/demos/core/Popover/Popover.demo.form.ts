import { defineComponent, h } from 'vue'
import { Button, Popover, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Button, TextInput } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="300" trap-focus position="bottom" with-arrow shadow="md">
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <TextInput label="Name" placeholder="Name" size="xs" />
      <TextInput label="Email" placeholder="john@doe.com" size="xs" mt="xs" />
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'PopoverFormDemo',
  setup() {
    return () =>
      h(
        Popover,
        { width: 300, trapFocus: true, position: 'bottom', withArrow: true, shadow: 'md' },
        {
          default: () => [
            h(Popover.Target, null, {
              default: () => h(Button, null, () => 'Toggle popover'),
            }),
            h(Popover.Dropdown, null, {
              default: () => [
                h(TextInput, { label: 'Name', placeholder: 'Name', size: 'xs' }),
                h(TextInput, { label: 'Email', placeholder: 'john@doe.com', size: 'xs', mt: 'xs' }),
              ],
            }),
          ],
        },
      )
  },
})

export const form: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
