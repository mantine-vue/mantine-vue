import { defineComponent, h, ref, computed } from 'vue'
import { ScrollArea, TextInput, UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ScrollArea, UnstyledButton, TextInput } from '@mantine-vue/core'

const groceries = [
  '🍎 Apples', '🍌 Bananas', '🍊 Oranges', '🥛 Milk', '🍞 Bread',
  '🥚 Eggs', '🍗 Chicken', '🥩 Beef', '🍝 Pasta', '🍚 Rice',
  '🥔 Potatoes', '🧅 Onions', '🍅 Tomatoes', '🥒 Cucumbers', '🥕 Carrots',
  '🥬 Lettuce', '🍃 Spinach', '🥦 Broccoli', '🧀 Cheese', '🍦 Yogurt',
]

const viewport = ref<any>(null)
const query = ref('')
const hovered = ref(-1)
const filtered = computed(() =>
  groceries.filter((item) => item.toLowerCase().includes(query.value.toLowerCase()))
)

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    hovered.value = Math.min(hovered.value + 1, filtered.value.length - 1)
    viewport.value?.$el
      ?.querySelectorAll('[data-list-item]')
      ?.[hovered.value]?.scrollIntoView({ block: 'nearest' })
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    hovered.value = Math.max(hovered.value - 1, 0)
    viewport.value?.$el
      ?.querySelectorAll('[data-list-item]')
      ?.[hovered.value]?.scrollIntoView({ block: 'nearest' })
  }
}
</script>

<template>
  <TextInput
    :value="query"
    placeholder="Search groceries"
    @input="(e) => { query = e.target.value; hovered = -1 }"
    @keydown="onKeyDown"
  />
  <ScrollArea :h="150" type="always" mt="md" :viewportProps="{ ref: viewport }">
    <UnstyledButton
      v-for="(item, index) in filtered"
      :key="item"
      data-list-item
      display="block"
      :bg="index === hovered ? 'var(--mantine-color-blue-light)' : undefined"
      w="100%"
      :p="5"
    >
      {{ item }}
    </UnstyledButton>
  </ScrollArea>
</template>
`

const groceries: string[] = [
  '🍎 Apples',
  '🍌 Bananas',
  '🍊 Oranges',
  '🥛 Milk',
  '🍞 Bread',
  '🥚 Eggs',
  '🍗 Chicken',
  '🥩 Beef',
  '🍝 Pasta',
  '🍚 Rice',
  '🥔 Potatoes',
  '🧅 Onions',
  '🍅 Tomatoes',
  '🥒 Cucumbers',
  '🥕 Carrots',
  '🥬 Lettuce',
  '🍃 Spinach',
  '🥦 Broccoli',
  '🧀 Cheese',
  '🍦 Yogurt',
  '🧈 Butter',
  '🍚 Sugar',
  '🧂 Salt',
  '🌶️ Pepper',
  '☕ Coffee',
  '🍵 Tea',
  '🥤 Juice',
  '💧 Water',
  '🍪 Cookies',
  '🍫 Chocolate',
]

const Demo = defineComponent({
  name: 'ScrollAreaScrollIntoViewDemo',
  setup() {
    const viewport = ref<any>(null)
    const query = ref('')
    const hovered = ref(-1)
    const filtered = computed(() =>
      groceries.filter((item) => item.toLowerCase().includes(query.value.toLowerCase())),
    )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const next = Math.min(hovered.value + 1, filtered.value.length - 1)
        hovered.value = next
        viewport.value?.$el
          ?.querySelectorAll('[data-list-item]')
          ?.[next]?.scrollIntoView({ block: 'nearest' })
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prev = Math.max(hovered.value - 1, 0)
        hovered.value = prev
        viewport.value?.$el
          ?.querySelectorAll('[data-list-item]')
          ?.[prev]?.scrollIntoView({ block: 'nearest' })
      }
    }

    return () => [
      h(TextInput, {
        value: query.value,
        placeholder: 'Search groceries',
        onInput: (e: Event) => {
          query.value = (e.target as HTMLInputElement).value
          hovered.value = -1
        },
        onKeydown: onKeyDown,
      }),
      h(
        ScrollArea,
        { h: 150, type: 'always', mt: 'md', viewportProps: { ref: viewport } },
        {
          default: () =>
            filtered.value.map((item, index) =>
              h(
                UnstyledButton,
                {
                  key: item,
                  'data-list-item': true,
                  display: 'block',
                  bg: index === hovered.value ? 'var(--mantine-color-blue-light)' : undefined,
                  w: '100%',
                  p: 5,
                },
                { default: () => item },
              ),
            ),
        },
      ),
    ]
  },
})

export const scrollIntoView: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
