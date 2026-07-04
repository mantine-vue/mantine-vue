import { defineComponent, h, ref } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from '@mantine-vue/core'

const value = ref(['React', 'Angular', 'Vue'])
</script>

<template>
  <MultiSelect
    label="Drag pills to reorder"
    description="Selected values can be reordered by dragging pills"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte', 'Solid', 'Ember']"
    :value="value"
    @change="(v) => (value = v)"
    with-pills-reorder
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectDragReorderDemo',
  setup() {
    const value = ref(['React', 'Angular', 'Vue'])
    return () =>
      h(MultiSelect, {
        label: 'Drag pills to reorder',
        description: 'Selected values can be reordered by dragging pills',
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte', 'Solid', 'Ember'],
        value: value.value,
        onChange: (v: string[]) => {
          value.value = v
        },
        withPillsReorder: true,
      })
  },
})

export const dragReorder: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
