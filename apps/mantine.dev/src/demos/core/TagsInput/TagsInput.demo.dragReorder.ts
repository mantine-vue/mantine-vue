import { defineComponent, h, ref } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { TagsInput } from '@mantine-vue/core'

const value = ref(['first', 'second', 'third'])
</script>

<template>
  <TagsInput
    label="Drag pills to reorder"
    description="Tags can be reordered by dragging pills"
    placeholder="Enter tag"
    v-model="value"
    with-pills-reorder
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDragReorderDemo',
  setup() {
    const value = ref(['first', 'second', 'third'])
    return () =>
      h(TagsInput, {
        label: 'Drag pills to reorder',
        description: 'Tags can be reordered by dragging pills',
        placeholder: 'Enter tag',
        value: value.value,
        onChange: (v: string[]) => {
          value.value = v
        },
        withPillsReorder: true,
      })
  },
})

export const dragReorder: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
