import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Press Enter to submit a tag"
    placeholder="Enter tag"
    :default-value="['React']"
    clearable
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputClearableDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Enter tag',
      defaultValue: ['React'],
      clearable: true,
    }),
})

export const clearable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
