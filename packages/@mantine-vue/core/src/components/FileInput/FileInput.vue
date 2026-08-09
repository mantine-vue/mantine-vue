<script lang="ts">
import { h } from 'vue'

/**
 * Default renderer for the selected file or files: a single truncated line of names.
 * A file name can be arbitrarily long, so it has to be clipped rather than wrapped —
 * the input is a single-line control.
 */
function defaultValueComponent(value: File | File[] | null) {
  const label = Array.isArray(value) ? value.map((file) => file.name).join(', ') : value?.name

  return h(
    'div',
    { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
    label,
  )
}

export { defaultValueComponent }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch, type VNodeChild } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { hasNode, resolveNode } from '../../core'
import { CloseButton } from '../CloseButton'
import { FileButton } from '../FileButton'
import { InputPlaceholder } from '../Input'
import { InputBase } from '../InputBase'
import type { FileInputProps, FileInputSlots } from './FileInput.types'

defineOptions({
  name: 'FileInput',
  inheritAttrs: false,
})

/**
 *
 * Intentionally undefined to preserve downstream defaults.
 */
const props = withDefaults(defineProps<FileInputProps>(), {
  component: 'button',
  modelValue: undefined,
  defaultValue: undefined,
  multiple: false,
  clearable: false,
  clearSectionMode: 'both',
  readOnly: false,
  capture: undefined,
  placeholder: undefined,
  rightSection: undefined,
  size: 'sm',
  label: undefined,
  description: undefined,
  error: undefined,
  required: false,
  withAsterisk: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
  change: [value: File | File[] | null]
}>()

defineSlots<FileInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

/** Assigned by `FileButton`; calling it clears the native input's file list. */
const resetRef = ref<(() => void) | null>(null)

/**
 * Passed to `FileButton` as a setter rather than as the ref itself: a template binding
 * unwraps a ref, so `:reset-ref="resetRef"` would hand over `null`.
 */
const setResetRef = (fn: (() => void) | null) => {
  resetRef.value = fn
}

const [value, setValue] = useUncontrolled<File | File[] | null>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: props.multiple ? [] : null,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const hasValue = computed(() =>
  Array.isArray(value.value) ? value.value.length !== 0 : value.value !== null,
)

function reset() {
  resetRef.value?.()
}

assignRef(props.resetRef, reset)

/**
 * Clearing the value has to clear the native input too, otherwise picking the same file
 * again would not fire a `change` event.
 */
watch(
  value,
  (nextValue) => {
    if ((Array.isArray(nextValue) && nextValue.length === 0) || nextValue === null) {
      resetRef.value?.()
    }
  },
  { deep: true },
)

const clearButton = computed(() =>
  h(CloseButton, {
    ...props.clearButtonProps,
    variant: 'subtle',
    size: props.size,
    unstyled: props.unstyled,
    onClick: () => setValue(props.multiple ? [] : null),
  }),
)

const clearable = computed(() => props.clearable && hasValue.value && !props.readOnly)

const placeholder = computed(() => resolveNode(props.placeholder, slots.placeholder))

/**
 * Both the value renderer and the placeholder produce VNodes. The `value` slot takes
 * precedence over `valueComponent`, which is kept as a lower-priority fallback.
 */
const renderValue = (): VNodeChild => {
  if (slots.value) {
    return slots.value({ value: value.value })
  }

  return (props.valueComponent ?? defaultValueComponent)(value.value)
}
const renderPlaceholder = (): VNodeChild => placeholder.value as VNodeChild
</script>

<template>
  <FileButton
    :multiple="props.multiple"
    :accept="props.accept"
    :name="props.name"
    :form="props.form"
    :disabled="props.readOnly"
    :capture="props.capture"
    :input-props="props.fileInputProps"
    :reset-ref="setResetRef"
    @change="setValue"
  >
    <template #default="{ onClick }">
      <InputBase
        v-bind="attrs"
        :component="props.component || 'button'"
        :right-section="props.rightSection"
        :__clear-section="clearButton"
        :__clearable="clearable"
        :__clear-section-mode="props.clearSectionMode"
        __static-selector="FileInput"
        :__styles-api-props="props"
        :multiline="true"
        type="button"
        :pointer="true"
        :unstyled="props.unstyled"
        :size="props.size"
        :label="props.label"
        :description="props.description"
        :error="props.error"
        :required="props.required"
        :with-asterisk="props.withAsterisk"
        :wrapper-props="props.wrapperProps"
        :class-names="props.classNames as any"
        :styles="props.styles as any"
        :vars="props.vars as any"
        @click="onClick"
      >
        <template v-if="slots.label" #label><slot name="label" /></template>
        <template v-if="slots.description" #description><slot name="description" /></template>
        <template v-if="slots.error" #error><slot name="error" /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>

        <component :is="renderValue" v-if="hasValue" />
        <InputPlaceholder v-else-if="hasNode(placeholder)" __static-selector="FileInput">
          <component :is="renderPlaceholder" />
        </InputPlaceholder>
      </InputBase>
    </template>
  </FileButton>
</template>
