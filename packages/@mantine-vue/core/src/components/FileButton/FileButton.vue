<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import type { FileButtonProps, FileButtonSlots } from './FileButton.types'

defineOptions({
  name: 'FileButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileButtonProps>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  capture: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
  change: [value: File | File[] | null]
}>()

defineSlots<FileButtonSlots>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | null>(null)

/** Clears the native input so picking the same file again still fires `change`. */
function reset() {
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

assignRef(props.resetRef, reset)

function onClick() {
  if (!props.disabled) {
    inputRef.value?.click()
  }
}

function setInputRef(node: any) {
  inputRef.value = node
  assignRef(props.inputRef, node)
}

function onChange(event: Event) {
  const files = (event.currentTarget as HTMLInputElement).files
  const nextValue =
    files === null
      ? props.multiple
        ? []
        : null
      : props.multiple
        ? Array.from(files)
        : files[0] || null

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<template>
  <input
    :ref="setInputRef"
    v-bind="props.inputProps"
    :style="[{ display: 'none' }, props.inputProps?.style]"
    type="file"
    :accept="props.accept"
    :multiple="props.multiple"
    :name="props.name"
    :form="props.form"
    :capture="props.capture"
    @change="onChange"
  />

  <slot v-bind="{ onClick, ...attrs }" />
</template>
