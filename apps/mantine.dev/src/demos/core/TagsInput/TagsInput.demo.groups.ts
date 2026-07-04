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
    placeholder="Enter tags"
    :data="[
      { group: 'Frontend', items: ['React', 'Angular'] },
      { group: 'Backend', items: ['Express', 'Django'] },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputGroupsDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Enter tags',
      placeholder: 'Enter tags',
      data: [
        { group: 'Frontend', items: ['React', 'Angular'] },
        { group: 'Backend', items: ['Express', 'Django'] },
      ],
    }),
})

export const groups: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
