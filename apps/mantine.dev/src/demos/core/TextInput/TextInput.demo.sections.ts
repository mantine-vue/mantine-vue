import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <TextInput
    left-section-pointer-events="none"
    :left-section="h(PhAt, { size: 16 })"
    label="Your email"
    placeholder="Your email"
  />
  <TextInput
    mt="md"
    right-section-pointer-events="none"
    :right-section="h(PhAt, { size: 16 })"
    label="Your email"
    placeholder="Your email"
  />
</template>
`

const Demo = defineComponent({
  name: 'TextInputSectionsDemo',
  setup() {
    const icon = h(PhAt, { size: 16 })
    return () =>
      h('div', null, [
        h(TextInput, {
          leftSectionPointerEvents: 'none',
          leftSection: icon,
          label: 'Your email',
          placeholder: 'Your email',
        }),
        h(TextInput, {
          mt: 'md',
          rightSectionPointerEvents: 'none',
          rightSection: icon,
          label: 'Your email',
          placeholder: 'Your email',
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
