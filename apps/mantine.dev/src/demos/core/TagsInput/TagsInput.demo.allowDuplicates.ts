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
    placeholder="Duplicates are allowed"
    allow-duplicates
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputAllowDuplicatesDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Duplicates are allowed',
      allowDuplicates: true,
    }),
})

export const allowDuplicates: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
