<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import type { AmPmInputEmits, AmPmInputProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'AmPmInput', inheritAttrs: false })
const props = withDefaults(defineProps<AmPmInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  labels: () => ({ am: 'AM', pm: 'PM' }),
  disabled: false,
  readOnly: false,
})
const emit = defineEmits<
  AmPmInputEmits & {
    'update:modelValue': [value: string | null]
    change: [value: string | null]
  }
>()
const attrs = useAttrs()
const [value, setValue] = useUncontrolled<string | null>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
function change(event: Event) {
  if (!props.readOnly) setValue((event.target as HTMLSelectElement).value || null)
}
function keydown(event: KeyboardEvent) {
  if (props.readOnly) return
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    if (value.value === null) emit('previous-input')
    else setValue(null)
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('previous-input')
  }
}
</script>

<template>
  <select
    v-bind="attrs"
    :class="[classes.timePickerField, attrs.class]"
    data-am-pm
    :disabled="props.disabled"
    :aria-readonly="props.readOnly || undefined"
    :value="value ?? ''"
    @change="change"
    @keydown="keydown"
  >
    <option value="">--</option>
    <option :value="props.labels.am">{{ props.labels.am }}</option>
    <option :value="props.labels.pm">{{ props.labels.pm }}</option>
  </select>
</template>
