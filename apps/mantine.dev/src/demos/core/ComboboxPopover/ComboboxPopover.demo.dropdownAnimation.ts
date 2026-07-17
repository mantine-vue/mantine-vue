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
    :combobox-props="{ transitionProps: { transition: 'pop', duration: 200 } }"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">With animation</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverDropdownAnimationDemo',
  setup() {
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          comboboxProps: { transitionProps: { transition: 'pop', duration: 200 } },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => 'With animation'),
          ),
      )
  },
})

export const dropdownAnimation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
