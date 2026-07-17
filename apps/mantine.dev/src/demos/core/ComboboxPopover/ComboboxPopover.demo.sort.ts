import { defineComponent, h, ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { ComboboxItem, OptionsFilter, Primitive } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { OptionsFilter, ComboboxItem, Primitive } from '@mantine-vue/core'

const value = ref<string | null>(null)

const optionsFilter: OptionsFilter<Primitive> = ({ options, search }) => {
  const filtered = (options as ComboboxItem<Primitive>[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
  )

  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}
</script>

<template>
  <ComboboxPopover
    :data="['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte']"
    :value="value"
    searchable
    :filter="optionsFilter"
    nothing-found-message="Nothing found..."
    @change="value = $event"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select framework' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const optionsFilter: OptionsFilter<Primitive> = ({ options, search }) => {
  const filtered = (options as ComboboxItem<Primitive>[]).filter((option) =>
    option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
  )

  filtered.sort((a, b) => a.label.localeCompare(b.label))
  return filtered
}

const Demo = defineComponent({
  name: 'ComboboxPopoverSortDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['4 – React', '1 – Angular', '3 – Vue', '2 – Svelte'],
          value: value.value,
          searchable: true,
          filter: optionsFilter,
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

export const sort: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
