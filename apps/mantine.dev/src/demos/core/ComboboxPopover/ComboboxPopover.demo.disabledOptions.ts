import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover } from '@mantine-vue/core'

const data = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'vue', label: 'Vue', disabled: true },
  { value: 'svelte', label: 'Svelte', disabled: true },
]
</script>

<template>
  <ComboboxPopover :data="data">
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">Select framework</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const data = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'vue', label: 'Vue', disabled: true },
  { value: 'svelte', label: 'Svelte', disabled: true },
]

const Demo = defineComponent({
  name: 'ComboboxPopoverDisabledOptionsDemo',
  setup() {
    return () =>
      h(ComboboxPopover, { data }, () =>
        h(ComboboxPopover.Target, null, () =>
          h(Button, { variant: 'default', miw: 200 }, () => 'Select framework'),
        ),
      )
  },
})

export const disabledOptions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
