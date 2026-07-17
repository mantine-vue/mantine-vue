import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover } from '@mantine-vue/core'
</script>

<template>
  <ComboboxPopover :data="[]" nothing-found-message="No options available">
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">Open dropdown</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverNothingFoundDemo',
  setup() {
    return () =>
      h(ComboboxPopover, { data: [], nothingFoundMessage: 'No options available' }, () =>
        h(ComboboxPopover.Target, null, () =>
          h(Button, { variant: 'default', miw: 200 }, () => 'Open dropdown'),
        ),
      )
  },
})

export const nothingFound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
