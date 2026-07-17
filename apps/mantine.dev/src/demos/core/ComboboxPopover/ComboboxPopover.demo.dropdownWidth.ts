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
    :combobox-props="{ width: 250, position: 'bottom-start' }"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">Select framework</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverDropdownWidthDemo',
  setup() {
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          comboboxProps: { width: 250, position: 'bottom-start' },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => 'Select framework'),
          ),
      )
  },
})

export const dropdownWidth: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
