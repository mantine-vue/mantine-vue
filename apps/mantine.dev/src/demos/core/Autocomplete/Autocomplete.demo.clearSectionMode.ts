import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { Autocomplete, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { Autocomplete, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Autocomplete
      label="clearSectionMode='both' (default)"
      placeholder="Pick value"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      default-value="React"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="both"
    />
    <Autocomplete
      label="clearSectionMode='rightSection'"
      placeholder="Pick value"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      default-value="React"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="rightSection"
    />
    <Autocomplete
      label="clearSectionMode='clear'"
      placeholder="Pick value"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      default-value="React"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="clear"
    />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteClearSectionModeDemo',
  setup() {
    const caretIcon = h(PhCaretDown, { size: 16 })
    return () =>
      h(Stack, null, () => [
        h(Autocomplete, {
          label: "clearSectionMode='both' (default)",
          placeholder: 'Pick value',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: 'React',
          clearable: true,
          rightSection: caretIcon,
          clearSectionMode: 'both',
        }),
        h(Autocomplete, {
          label: "clearSectionMode='rightSection'",
          placeholder: 'Pick value',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: 'React',
          clearable: true,
          rightSection: caretIcon,
          clearSectionMode: 'rightSection',
        }),
        h(Autocomplete, {
          label: "clearSectionMode='clear'",
          placeholder: 'Pick value',
          data: ['React', 'Angular', 'Vue', 'Svelte'],
          defaultValue: 'React',
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
