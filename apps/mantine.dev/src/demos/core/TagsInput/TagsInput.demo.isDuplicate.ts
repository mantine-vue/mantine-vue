import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'

const isDuplicate = (tagValue: string, currentTags: string[]) =>
  currentTags.some((val) => val === tagValue)
</script>

<template>
  <TagsInput
    label="Press Enter to submit a tag"
    placeholder="Enter tag"
    :is-duplicate="isDuplicate"
    :default-value="['Tag', 'TAG', 'tag']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputIsDuplicateDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Enter tag',
      isDuplicate: (tagValue: string, currentTags: string[]) =>
        currentTags.some((val) => val === tagValue),
      defaultValue: ['Tag', 'TAG', 'tag'],
    }),
})

export const isDuplicate: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
