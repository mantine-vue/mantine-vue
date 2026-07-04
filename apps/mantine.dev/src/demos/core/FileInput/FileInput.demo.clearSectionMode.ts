import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { FileInput, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { FileInput, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <FileInput
      label="clearSectionMode='both' (default)"
      placeholder="Pick file"
      clearable
      clearSectionMode="both"
    >
      <template #rightSection>
        <PhCaretDown :size="16" />
      </template>
    </FileInput>

    <FileInput
      label="clearSectionMode='rightSection'"
      placeholder="Pick file"
      clearable
      clearSectionMode="rightSection"
    >
      <template #rightSection>
        <PhCaretDown :size="16" />
      </template>
    </FileInput>

    <FileInput
      label="clearSectionMode='clear'"
      placeholder="Pick file"
      clearable
      clearSectionMode="clear"
    >
      <template #rightSection>
        <PhCaretDown :size="16" />
      </template>
    </FileInput>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'FileInputClearSectionModeDemo',
  setup() {
    const icon = h(PhCaretDown, { size: 16 })
    return () =>
      h(Stack, null, {
        default: () => [
          h(FileInput, {
            label: "clearSectionMode='both' (default)",
            placeholder: 'Pick file',
            clearable: true,
            rightSection: icon,
            clearSectionMode: 'both',
          }),
          h(FileInput, {
            label: "clearSectionMode='rightSection'",
            placeholder: 'Pick file',
            clearable: true,
            rightSection: icon,
            clearSectionMode: 'rightSection',
          }),
          h(FileInput, {
            label: "clearSectionMode='clear'",
            placeholder: 'Pick file',
            clearable: true,
            rightSection: icon,
            clearSectionMode: 'clear',
          }),
        ],
      })
  },
})

export const clearSectionMode: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
