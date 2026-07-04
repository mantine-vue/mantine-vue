import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput placeholder="Enter tags" loading />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputLoadingDemo',
  setup: () => () =>
    h(TagsInput, {
      placeholder: 'Enter tags',
      loading: true,
    }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
