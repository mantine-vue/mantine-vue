import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Enter tags"
    placeholder="Some tags are disabled"
    :data="[
      { value: 'React', label: 'React' },
      { value: 'Angular', label: 'Angular' },
      { value: 'Vue', label: 'Vue', disabled: true },
      { value: 'Svelte', label: 'Svelte', disabled: true },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDisabledOptionsDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Enter tags',
      placeholder: 'Some tags are disabled',
      data: [
        { value: 'React', label: 'React' },
        { value: 'Angular', label: 'Angular' },
        { value: 'Vue', label: 'Vue', disabled: true },
        { value: 'Svelte', label: 'Svelte', disabled: true },
      ],
    }),
})

export const disabledOptions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
