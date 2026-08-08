<script setup lang="ts">
import { provide } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { ChipGroupContextKey } from './ChipGroup.context'
import type { ChipGroupProps, ChipGroupSlots, ChipGroupValue } from './ChipGroup.types'

defineOptions({ name: 'ChipGroup' })

const props = withDefaults(defineProps<ChipGroupProps>(), {
  multiple: false,
  modelValue: undefined,
  defaultValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: ChipGroupValue]
  change: [value: ChipGroupValue]
}>()

defineSlots<ChipGroupSlots>()

const [value, setValue] = useUncontrolled<ChipGroupValue>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: props.multiple ? [] : null,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

function isChipSelected(chipValue: string) {
  return Array.isArray(value.value) ? value.value.includes(chipValue) : value.value === chipValue
}

function handleChange(event: Event) {
  const chipValue = String((event.currentTarget as HTMLInputElement | null)?.value ?? '')

  if (Array.isArray(value.value)) {
    setValue(
      value.value.includes(chipValue)
        ? value.value.filter((item) => item !== chipValue)
        : [...value.value, chipValue],
    )
  } else {
    setValue(chipValue)
  }
}

/** Getters keep the provided object reactive without changing the shape consumers read. */
provide(ChipGroupContextKey, {
  isChipSelected,
  onChange: handleChange,
  get multiple() {
    return props.multiple
  },
})
</script>

<template>
  <!-- `display: contents` keeps the group out of the layout: the chips lay out as if
       they were direct children of the group's parent. -->
  <div :style="{ display: 'contents' }">
    <slot />
  </div>
</template>
