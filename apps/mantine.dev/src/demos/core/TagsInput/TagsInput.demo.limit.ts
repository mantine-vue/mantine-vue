import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'

const largeData = Array(100_000)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <TagsInput
    label="100 000 options tags input"
    placeholder="Use limit to optimize performance"
    :limit="5"
    :data="largeData"
  />
</template>
`

const largeData = Array(100_000)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'TagsInputLimitDemo',
  setup: () => () =>
    h(TagsInput, {
      label: '100 000 options tags input',
      placeholder: 'Use limit to optimize performance',
      limit: 5,
      data: largeData,
    }),
})

export const limit: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
