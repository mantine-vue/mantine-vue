import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <Select
    label="With scroll area (default)"
    placeholder="Pick value"
    :data="data"
    :max-dropdown-height="200"
  />

  <Select
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
  name: 'SelectScrollAreaDemo',
  setup: () => () =>
    h('div', null, [
      h(Select, {
        label: 'With scroll area (default)',
        placeholder: 'Pick value',
        data,
        maxDropdownHeight: 200,
      }),
      h(Select, {
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
