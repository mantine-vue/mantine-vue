import { defineComponent, h } from 'vue'
import { PhSquaresFour } from '@phosphor-icons/vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhSquaresFour } from '@phosphor-icons/vue'
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    :data="['React', 'Angular', 'Vue']"
    left-section-pointer-events="none"
    :left-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite library"
    placeholder="Your favorite library"
  />
  <TagsInput
    mt="md"
    :data="['React', 'Angular', 'Vue']"
    right-section-pointer-events="none"
    :right-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite library"
    placeholder="Your favorite library"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputSectionsDemo',
  setup: () => () => {
    const icon = h(PhSquaresFour, { size: 16 })
    return h('div', null, [
      h(TagsInput, {
        data: ['React', 'Angular', 'Vue'],
        leftSectionPointerEvents: 'none',
        leftSection: icon,
        label: 'Your favorite library',
        placeholder: 'Your favorite library',
      }),
      h(TagsInput, {
        mt: 'md',
        data: ['React', 'Angular', 'Vue'],
        rightSectionPointerEvents: 'none',
        rightSection: icon,
        label: 'Your favorite library',
        placeholder: 'Your favorite library',
      }),
    ])
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
