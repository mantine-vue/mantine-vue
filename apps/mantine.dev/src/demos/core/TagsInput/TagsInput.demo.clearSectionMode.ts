import { defineComponent, h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { Stack, TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import { Stack, TagsInput } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <TagsInput
      label="clearSectionMode='both' (default)"
      placeholder="Enter tags"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :default-value="['React']"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="both"
    />

    <TagsInput
      label="clearSectionMode='rightSection'"
      placeholder="Enter tags"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
      :default-value="['React']"
      clearable
      :right-section="h(PhCaretDown, { size: 16 })"
      clear-section-mode="rightSection"
    />

    <TagsInput
      label="clearSectionMode='clear'"
      placeholder="Enter tags"
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
  name: 'TagsInputClearSectionModeDemo',
  setup: () => () =>
    h(Stack, null, () => [
      h(TagsInput, {
        label: "clearSectionMode='both' (default)",
        placeholder: 'Enter tags',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: ['React'],
        clearable: true,
        rightSection: h(PhCaretDown, { size: 16 }),
        clearSectionMode: 'both',
      }),
      h(TagsInput, {
        label: "clearSectionMode='rightSection'",
        placeholder: 'Enter tags',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: ['React'],
        clearable: true,
        rightSection: h(PhCaretDown, { size: 16 }),
        clearSectionMode: 'rightSection',
      }),
      h(TagsInput, {
        label: "clearSectionMode='clear'",
        placeholder: 'Enter tags',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        defaultValue: ['React'],
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
