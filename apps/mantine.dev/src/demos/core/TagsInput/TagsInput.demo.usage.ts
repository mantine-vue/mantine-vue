import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput label="Press Enter to submit a tag" placeholder="Enter tag" />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputUsageDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Enter tag',
    }),
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
