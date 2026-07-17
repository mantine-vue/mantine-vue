import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover } from '@mantine-vue/core'

const data = Array(50)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <ComboboxPopover :data="data" :max-dropdown-height="200">
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">Select option</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const data = Array(50)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'ComboboxPopoverScrollAreaDemo',
  setup() {
    return () =>
      h(ComboboxPopover, { data, maxDropdownHeight: 200 }, () =>
        h(ComboboxPopover.Target, null, () =>
          h(Button, { variant: 'default', miw: 200 }, () => 'Select option'),
        ),
      )
  },
})

export const scrollArea: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
