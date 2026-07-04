import { defineComponent, h } from 'vue'
import { Group, TagsInput, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, TagsInput, Text } from '@mantine-vue/core'

const groceryData: Record<string, { emoji: string; description: string }> = {
  Apples: { emoji: '🍎', description: 'Crisp and juicy snacking delight' },
  Bread: { emoji: '🍞', description: 'Freshly baked daily essential' },
  Bananas: { emoji: '🍌', description: 'Perfect for a healthy breakfast' },
  Eggs: { emoji: '🥚', description: 'Versatile protein source for cooking' },
  Broccoli: { emoji: '🥦', description: 'Nutrient-rich green vegetable' },
}

const renderOptionFn = ({ option }) =>
  h(Group, null, () => [
    h(Text, { span: true, fz: 24 }, () => groceryData[option.value].emoji),
    h('div', null, [
      h(Text, null, () => option.value),
      h(Text, { size: 'xs', opacity: 0.5 }, () => groceryData[option.value].description),
    ]),
  ])
</script>

<template>
  <TagsInput
    :data="['Apples', 'Bread', 'Bananas', 'Eggs', 'Broccoli']"
    :render-option="renderOptionFn"
    label="Groceries"
    placeholder="Pick tag from list or type to add new"
    :max-dropdown-height="300"
  />
</template>
`

const groceryData: Record<string, { emoji: string; description: string }> = {
  Apples: { emoji: '🍎', description: 'Crisp and juicy snacking delight' },
  Bread: { emoji: '🍞', description: 'Freshly baked daily essential' },
  Bananas: { emoji: '🍌', description: 'Perfect for a healthy breakfast' },
  Eggs: { emoji: '🥚', description: 'Versatile protein source for cooking' },
  Broccoli: { emoji: '🥦', description: 'Nutrient-rich green vegetable' },
}

const renderOptionFn = ({ option }: { option: { value: string; label: string } }) =>
  h(Group, null, () => [
    h(Text, { span: true, fz: 24 }, () => groceryData[option.value].emoji),
    h('div', null, [
      h(Text, null, () => option.value),
      h(Text, { size: 'xs', opacity: 0.5 }, () => groceryData[option.value].description),
    ]),
  ])

const Demo = defineComponent({
  name: 'TagsInputRenderOptionDemo',
  setup: () => () =>
    h(TagsInput, {
      data: ['Apples', 'Bread', 'Bananas', 'Eggs', 'Broccoli'],
      renderOption: renderOptionFn,
      label: 'Groceries',
      placeholder: 'Pick tag from list or type to add new',
      maxDropdownHeight: 300,
    }),
})

export const renderOption: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
  defaultExpanded: false,
}
