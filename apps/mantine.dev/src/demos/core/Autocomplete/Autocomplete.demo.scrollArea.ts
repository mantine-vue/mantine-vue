import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <Autocomplete
    label="With scroll area (default)"
    placeholder="Pick value or enter anything"
    :data="data"
    :max-dropdown-height="200"
  />
  <Autocomplete
    label="With native scroll"
    placeholder="Pick value or enter anything"
    :data="data"
    :with-scroll-area="false"
    :styles="{ dropdown: { maxHeight: '200px', overflowY: 'auto' } }"
    mt="md"
  />
</template>
`

const data = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'AutocompleteScrollAreaDemo',
  setup: () => () =>
    h('div', null, [
      h(Autocomplete, {
        label: 'With scroll area (default)',
        placeholder: 'Pick value or enter anything',
        data,
        maxDropdownHeight: 200,
      }),
      h(Autocomplete, {
        label: 'With native scroll',
        placeholder: 'Pick value or enter anything',
        data,
        withScrollArea: false,
        styles: { dropdown: { maxHeight: '200px', overflowY: 'auto' } },
        mt: 'md',
      }),
    ]),
})

export const scrollArea: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
