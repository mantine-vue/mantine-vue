import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Option can NOT be deselected"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    default-value="React"
    :allow-deselect="false"
  />

  <Select
    label="Option can be deselected"
    description="This is default behavior, click 'React' in the dropdown"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    default-value="React"
    allow-deselect
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectAllowDeselectDemo',
  setup: () => () =>
    h('div', null, [
      h(Select, {
        label: 'Option can NOT be deselected',
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: 'React',
        allowDeselect: false,
      }),
      h(Select, {
        label: 'Option can be deselected',
        description: "This is default behavior, click 'React' in the dropdown",
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: 'React',
        allowDeselect: true,
        mt: 'md',
      }),
    ]),
})

export const allowDeselect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
