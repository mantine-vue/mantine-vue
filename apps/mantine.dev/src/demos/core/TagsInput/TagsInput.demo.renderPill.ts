import { defineComponent, h } from 'vue'
import { Pill, TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput, Pill } from '@mantine-vue/core'

const renderPillFn = ({ value, onRemove }) =>
  h(Pill, { withRemoveButton: true, onRemove }, () => \`★ \${value}\`)
</script>

<template>
  <TagsInput
    label="Custom pills"
    description="Tags are rendered with a star prefix"
    placeholder="Enter tag"
    :default-value="['React', 'Angular']"
    :render-pill="renderPillFn"
  />
</template>
`

const renderPillFn = ({ value, onRemove }: { value: string; onRemove: () => void }) =>
  h(Pill, { withRemoveButton: true, onRemove }, () => `★ ${value}`)

const Demo = defineComponent({
  name: 'TagsInputRenderPillDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Custom pills',
      description: 'Tags are rendered with a star prefix',
      placeholder: 'Enter tag',
      defaultValue: ['React', 'Angular'],
      renderPill: renderPillFn,
    }),
})

export const renderPill: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
}
