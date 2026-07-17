import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'

const value = ref<string | null>(null)

const largeData = Array(1000)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <ComboboxPopover
    :data="largeData"
    :value="value"
    searchable
    :limit="5"
    nothing-found-message="Nothing found..."
    @change="value = $event"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select option' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const largeData = Array(1000)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'ComboboxPopoverLimitDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(
        ComboboxPopover,
        {
          data: largeData,
          value: value.value,
          searchable: true,
          limit: 5,
          nothingFoundMessage: 'Nothing found...',
          onChange: (val: string | null) => {
            value.value = val
          },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => value.value || 'Select option'),
          ),
      )
  },
})

export const limit: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
