import { defineComponent, h } from 'vue'
import { PhSquaresFour } from '@phosphor-icons/vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhSquaresFour } from '@phosphor-icons/vue'
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    :data="['React', 'Angular', 'Vue']"
    left-section-pointer-events="none"
    :left-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite libraries"
    placeholder="Your favorite libraries"
  />
  <MultiSelect
    mt="md"
    :data="['React', 'Angular', 'Vue']"
    right-section-pointer-events="none"
    :right-section="h(PhSquaresFour, { size: 16 })"
    label="Your favorite libraries"
    placeholder="Your favorite libraries"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectSectionsDemo',
  setup() {
    const icon = h(PhSquaresFour, { size: 16 })
    return () =>
      h('div', null, [
        h(MultiSelect, {
          data: ['React', 'Angular', 'Vue'],
          leftSectionPointerEvents: 'none',
          leftSection: icon,
          label: 'Your favorite libraries',
          placeholder: 'Your favorite libraries',
        }),
        h(MultiSelect, {
          mt: 'md',
          data: ['React', 'Angular', 'Vue'],
          rightSectionPointerEvents: 'none',
          rightSection: icon,
          label: 'Your favorite libraries',
          placeholder: 'Your favorite libraries',
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
