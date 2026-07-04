import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Read only"
    placeholder="Enter tag"
    read-only
    :default-value="['First', 'Second']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputReadOnlyDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Read only',
      placeholder: 'Enter tag',
      readOnly: true,
      defaultValue: ['First', 'Second'],
    }),
})

export const readOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
