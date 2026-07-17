import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'

const value = ref<string | null>(null)
</script>

<template>
  <ComboboxPopover
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :value="value"
    searchable
    nothing-found-message="Nothing found..."
    @change="value = $event"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select framework' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverSearchableDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          value: value.value,
          searchable: true,
          nothingFoundMessage: 'Nothing found...',
          onChange: (val: string | null) => {
            value.value = val
          },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => value.value || 'Select framework'),
          ),
      )
  },
})

export const searchable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
