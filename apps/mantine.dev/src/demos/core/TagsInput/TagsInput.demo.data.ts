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
    placeholder="Pick tag from list"
    :data="['React', 'Angular', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDataDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Press Enter to submit a tag',
      placeholder: 'Pick tag from list',
      data: ['React', 'Angular', 'Svelte'],
    }),
})

export const data: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
