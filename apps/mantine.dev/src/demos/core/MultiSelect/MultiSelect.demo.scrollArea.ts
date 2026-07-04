import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <MultiSelect
    label="With scroll area (default)"
    placeholder="Pick value"
    :data="data"
    :max-dropdown-height="200"
  />
  <MultiSelect
    label="With native scroll"
    placeholder="Pick value"
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
  name: 'MultiSelectScrollAreaDemo',
  setup: () => () =>
    h('div', null, [
      h(MultiSelect, {
        label: 'With scroll area (default)',
        placeholder: 'Pick value',
        data,
        maxDropdownHeight: 200,
      }),
      h(MultiSelect, {
        label: 'With native scroll',
        placeholder: 'Pick value',
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
