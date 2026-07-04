import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { MultiSelect, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { MultiSelect, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <MultiSelect
      label="clearSectionMode='both' (default)"
      placeholder="Pick values"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :default-value="['React']"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="both"
    />
    <MultiSelect
      label="clearSectionMode='rightSection'"
      placeholder="Pick values"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :default-value="['React']"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="rightSection"
    />
    <MultiSelect
      label="clearSectionMode='clear'"
      placeholder="Pick values"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :default-value="['React']"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="clear"
    />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectClearSectionModeDemo',
  setup() {
    const caretIcon = h(PhCaretDown, { size: 16 })
    return () =>
      h(Stack, null, () => [
        h(MultiSelect, {
          label: "clearSectionMode='both' (default)",
          placeholder: 'Pick values',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: ['React'],
          clearable: true,
          rightSection: caretIcon,
          clearSectionMode: 'both',
        }),
        h(MultiSelect, {
          label: "clearSectionMode='rightSection'",
          placeholder: 'Pick values',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: ['React'],
          clearable: true,
          rightSection: caretIcon,
          clearSectionMode: 'rightSection',
        }),
        h(MultiSelect, {
          label: "clearSectionMode='clear'",
          placeholder: 'Pick values',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: ['React'],
          clearable: true,
          rightSection: caretIcon,
          clearSectionMode: 'clear',
        }),
      ])
  },
})

export const clearSectionMode: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
