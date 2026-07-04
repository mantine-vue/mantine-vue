import { defineComponent, h } from 'vue'
import { Autocomplete, Button, Popover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Popover, Button, Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="300" position="bottom" with-arrow shadow="md">
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <Autocomplete
        label="Your favorite library"
        placeholder="Pick value or enter anything"
        :data="['React', 'Angular', 'Vue', 'Svelte']"
        :combobox-props="{ withinPortal: false }"
      />
    </Popover.Dropdown>
  </Popover>
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteWithinPopoverDemo',
  setup: () => () =>
    h(Popover, { width: 300, position: 'bottom', withArrow: true, shadow: 'md' }, () => [
      h(Popover.Target, null, () => h(Button, null, () => 'Toggle popover')),
      h(Popover.Dropdown, null, () =>
        h(Autocomplete, {
          label: 'Your favorite library',
          placeholder: 'Pick value or enter anything',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          comboboxProps: { withinPortal: false },
        }),
      ),
    ]),
})

export const withinPopover: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
