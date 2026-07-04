import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { Select, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { Select, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Select
      label="clearSectionMode='both' (default)"
      placeholder="Pick value"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      default-value="React"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="both"
    />

    <Select
      label="clearSectionMode='rightSection'"
      placeholder="Pick value"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      default-value="React"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="rightSection"
    />

    <Select
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
  name: 'SelectClearSectionModeDemo',
  setup: () => () =>
    h(Stack, null, () => [
      h(Select, {
        label: "clearSectionMode='both' (default)",
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: 'React',
        clearable: true,
        rightSection: h(PhCaretDown, { size: 16 }),
        clearSectionMode: 'both',
      }),
      h(Select, {
        label: "clearSectionMode='rightSection'",
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: 'React',
        clearable: true,
        rightSection: h(PhCaretDown, { size: 16 }),
        clearSectionMode: 'rightSection',
      }),
      h(Select, {
        label: "clearSectionMode='clear'",
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: 'React',
        clearable: true,
        rightSection: h(PhCaretDown, { size: 16 }),
        clearSectionMode: 'clear',
      }),
    ]),
})

export const clearSectionMode: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
