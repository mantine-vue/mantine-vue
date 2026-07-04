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
    :split-chars="[',', ' ', '|']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputSplitCharsDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Enter tag',
      splitChars: [',', ' ', '|'],
    }),
})

export const splitChars: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
