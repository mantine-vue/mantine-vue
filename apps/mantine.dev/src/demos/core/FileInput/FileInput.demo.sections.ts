import { defineComponent, h } from 'vue'
import { PhFileText } from '@phosphor-icons/vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhFileText } from '@phosphor-icons/vue'
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <FileInput
      label="Attach your CV"
      placeholder="Your CV"
      leftSectionPointerEvents="none"
    >
      <template #leftSection>
        <PhFileText :size="18" />
      </template>
    </FileInput>
    <FileInput
      label="Attach your CV"
      placeholder="Your CV"
      rightSectionPointerEvents="none"
      mt="md"
    >
      <template #rightSection>
        <PhFileText :size="18" />
      </template>
    </FileInput>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'FileInputSectionsDemo',
  setup() {
    const icon = h(PhFileText, { size: 18 })
    return () =>
      h('div', null, [
        h(FileInput, {
          leftSection: icon,
          label: 'Attach your CV',
          placeholder: 'Your CV',
          leftSectionPointerEvents: 'none',
        }),
        h(FileInput, {
          rightSection: icon,
          label: 'Attach your CV',
          placeholder: 'Your CV',
          rightSectionPointerEvents: 'none',
          mt: 'md',
        }),
      ])
  },
})

export const sections: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
