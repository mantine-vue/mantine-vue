<script setup lang="ts">
import { computed, ref } from 'vue'
import { createScopedKeydownHandler, UnstyledButton, useDirection } from '@mantine-vue/core'
import { getCanonicalCategoryIcon } from '../../categories'
import { useEmojiPickerContext } from './EmojiPicker.context'

defineOptions({ name: 'EmojiPickerCategoryNav' })

const props = defineProps<{ categories: { id: string; label: string }[] }>()
const emit = defineEmits<{ categoryClick: [categoryId: string] }>()

const ctx = useEmojiPickerContext()
const { dir } = useDirection()
const tabStopId = ref<string | null>(null)
const tabStopIndex = computed(() =>
  Math.max(
    props.categories.findIndex((category) => category.id === tabStopId.value),
    0,
  ),
)

const handleKeydown = (event: KeyboardEvent) =>
  createScopedKeydownHandler({
    siblingSelector: '[data-category-nav-button]',
    parentSelector: '[data-category-nav]',
    orientation: 'horizontal',
    loop: true,
    dir: dir.value,
  })(event)
</script>

<template>
  <div v-bind="ctx.getStyles('categoryNav')" data-category-nav>
    <UnstyledButton
      v-for="(category, index) in props.categories"
      :key="category.id"
      v-bind="ctx.getStyles('categoryNavButton')"
      :aria-label="category.label"
      :title="category.label"
      :tabindex="index === tabStopIndex ? 0 : -1"
      data-category-nav-button
      @focus="tabStopId = category.id"
      @keydown="handleKeydown"
      @click="emit('categoryClick', category.id)"
      >{{ getCanonicalCategoryIcon(category.id) || '📁' }}</UnstyledButton
    >
  </div>
</template>
