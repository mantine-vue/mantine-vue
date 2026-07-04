import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Boolean error"
    placeholder="Boolean error"
    error
    :default-value="['React', 'Angular']"
  />
  <TagsInput
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
    :default-value="['React', 'Angular']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(TagsInput, {
        label: 'Boolean error',
        placeholder: 'Boolean error',
        error: true,
        defaultValue: ['React', 'Angular'],
      }),
      h(TagsInput, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid name',
        defaultValue: ['React', 'Angular'],
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
