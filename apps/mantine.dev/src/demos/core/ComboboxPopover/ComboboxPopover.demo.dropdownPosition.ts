import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover } from '@mantine-vue/core'
</script>

<template>
  <ComboboxPopover
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ position: 'top', middlewares: { flip: false, shift: false } }"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">Open dropdown above</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverDropdownPositionDemo',
  setup() {
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          comboboxProps: { position: 'top', middlewares: { flip: false, shift: false } },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => 'Open dropdown above'),
          ),
      )
  },
})

export const dropdownPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
