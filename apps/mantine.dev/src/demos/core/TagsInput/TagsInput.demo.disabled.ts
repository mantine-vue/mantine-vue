import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Disabled"
    placeholder="Enter tag"
    disabled
    :default-value="['First', 'Second']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDisabledDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Disabled',
      placeholder: 'Enter tag',
      disabled: true,
      defaultValue: ['First', 'Second'],
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
