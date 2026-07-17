import { defineComponent, Fragment, h, ref } from 'vue'
import { Button, ComboboxPopover, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, ComboboxPopover, Text } from '@mantine-vue/core'

const value = ref<string | null>(null)
const searchValue = ref('')
</script>

<template>
  <ComboboxPopover
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :value="value"
    searchable
    :search-value="searchValue"
    @change="value = $event"
    @search-change="searchValue = $event"
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select framework' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>

  <Text mt="md" size="sm">Search value: <b>{{ searchValue || '(empty)' }}</b></Text>
  <Text size="sm">Selected value: <b>{{ value || '(none)' }}</b></Text>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxPopoverControlledSearchDemo',
  setup() {
    const value = ref<string | null>(null)
    const searchValue = ref('')
    return () =>
      h(Fragment, null, [
        h(
          ComboboxPopover,
          {
            data: ['React', 'Angular', 'Vue', 'Svelte'],
            value: value.value,
            searchable: true,
            searchValue: searchValue.value,
            onChange: (val: string | null) => {
              value.value = val
            },
            onSearchChange: (val: string) => {
              searchValue.value = val
            },
          },
          () =>
            h(ComboboxPopover.Target, null, () =>
              h(Button, { variant: 'default', miw: 200 }, () => value.value || 'Select framework'),
            ),
        ),
        h(Text, { mt: 'md', size: 'sm' }, () => [
          'Search value: ',
          h('b', null, searchValue.value || '(empty)'),
        ]),
        h(Text, { size: 'sm' }, () => ['Selected value: ', h('b', null, value.value || '(none)')]),
      ])
  },
})

export const controlledSearch: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
