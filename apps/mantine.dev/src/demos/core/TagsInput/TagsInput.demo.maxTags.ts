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
    description="Add up to 3 tags"
    placeholder="Enter tag"
    :max-tags="3"
    :default-value="['first', 'second']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputMaxTagsDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      description: 'Add up to 3 tags',
      placeholder: 'Enter tag',
      maxTags: 3,
      defaultValue: ['first', 'second'],
    }),
})

export const maxTags: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
