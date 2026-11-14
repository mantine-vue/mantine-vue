<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { CloseButton, Input, provideInputWrapperContext } from '@mantine-vue/core'
import { useEmojiPickerContext } from './EmojiPicker.context'

defineOptions({ name: 'EmojiPickerSearch' })

const props = defineProps<{
  query: string
  placeholder?: string
  autoFocus?: boolean
  controls?: string
  activeDescendant?: string
  searchInputProps?: Record<string, any>
}>()

const emit = defineEmits<{
  queryChange: [value: string]
  keydown: [event: KeyboardEvent]
}>()

const ctx = useEmojiPickerContext()
const inputElement = ref<HTMLInputElement | null>(null)

/* The search input must not inherit ids and descriptions of a parent input wrapper */
provideInputWrapperContext({
  offsetTop: false,
  offsetBottom: false,
  describedBy: undefined,
  inputId: undefined,
  labelId: undefined,
  getStyles: null,
})

function setInputRef(node: any) {
  inputElement.value = node?.$el ?? node ?? null
}

onMounted(() => {
  if (props.autoFocus) {
    inputElement.value?.focus({ preventScroll: true })
  }
})

function handleClear() {
  emit('queryChange', '')
  inputElement.value?.focus()
}

const clearButton = () =>
  props.query
    ? h(CloseButton, {
        size: 'sm',
        'aria-label': ctx.labels.clearSearch,
        onMousedown: (event: MouseEvent) => event.preventDefault(),
        onClick: handleClear,
      })
    : undefined

defineExpose({ focus: () => inputElement.value?.focus() })
</script>

<template>
  <div v-bind="ctx.getStyles('search')">
    <Input
      v-bind="{ ...ctx.getStyles('searchInput'), ...props.searchInputProps }"
      :root-ref="setInputRef"
      :size="ctx.size"
      :model-value="props.query"
      :placeholder="props.placeholder || ctx.labels.search"
      role="searchbox"
      :aria-label="ctx.labels.search"
      :aria-controls="props.controls"
      :aria-activedescendant="props.activeDescendant"
      right-section-pointer-events="all"
      :right-section="clearButton()"
      @input="emit('queryChange', ($event.target as HTMLInputElement).value)"
      @keydown="emit('keydown', $event)"
    />
  </div>
</template>
