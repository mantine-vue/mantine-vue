import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    clearable
    default-value="React"
    :data="['React', 'Angular']"
    label="Clearable autocomplete"
    placeholder="Clearable autocomplete"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteClearableDemo',
  setup: () => () =>
    h(Autocomplete, {
      clearable: true,
      defaultValue: 'React',
      data: ['React', 'Angular'],
      label: 'Clearable autocomplete',
      placeholder: 'Clearable autocomplete',
    }),
})

export const clearable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
