<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { padTime } from '../../utils'
import type { SpinInputEmits, SpinInputProps } from '../../types'

defineOptions({ name: 'SpinInput', inheritAttrs: false })
const props = withDefaults(defineProps<SpinInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  step: 1,
  allowTemporaryZero: false,
  placeholder: '--',
  disableAutoAdvance: false,
  disabled: false,
  readOnly: false,
})
const emit = defineEmits<
  SpinInputEmits & {
    'update:modelValue': [value: number | null]
    change: [value: number | null]
  }
>()
const attrs = useAttrs()
const [value, setValue] = useUncontrolled<number | null>({
  value: computed(() => props.modelValue),
  defaultValue: props.defaultValue,
  finalValue: null,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const finiteMax = () => Number.isFinite(props.max)
const maxDigit = () => (finiteMax() ? Number(props.max.toFixed(0)[0]) : Infinity)
const arrowsMax = () => props.max + 1 - props.step
function change(event: Event) {
  if (props.readOnly) return
  const input = event.currentTarget as HTMLInputElement
  const raw = input.value
  const digits = raw.replace(/\D/g, '')
  if (!digits) {
    input.value = value.value === null ? '' : padTime(value.value)
    return
  }
  let parsed = 0
  for (const character of digits) {
    const digit = Number(character)
    const next = parsed * 10 + digit
    parsed = finiteMax() && next > props.max ? digit : next
  }
  const clamped =
    props.allowTemporaryZero && parsed === 0 && props.min > 0
      ? 0
      : finiteMax()
        ? Math.min(Math.max(parsed, props.min), props.max)
        : Math.max(parsed, props.min)
  setValue(clamped)
  input.value = padTime(clamped)
  if (!props.disableAutoAdvance && (clamped > maxDigit() || raw.startsWith('00')))
    emit('next-input')
}
function keydown(event: KeyboardEvent) {
  if (props.readOnly) return
  if (
    !event.isComposing &&
    event.key.length === 1 &&
    !/^\d$/.test(event.key) &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault()
    return
  }
  const target = event.currentTarget as HTMLInputElement
  if (
    (event.key === '0' || event.key === 'Num0') &&
    value.value === 0 &&
    !(
      target.value.length &&
      target.selectionStart === 0 &&
      target.selectionEnd === target.value.length
    )
  ) {
    event.preventDefault()
    emit('next-input')
  }
  if (event.key === 'Home') {
    event.preventDefault()
    setValue(props.min)
  }
  if (event.key === 'End') {
    event.preventDefault()
    if (finiteMax()) setValue(props.max)
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    if (value.value !== null) setValue(null)
    else emit('previous-input')
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    emit('next-input')
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('previous-input')
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    setValue(
      value.value === null
        ? props.min
        : finiteMax()
          ? Math.min(Math.max(value.value + props.step, props.min), arrowsMax())
          : Math.max(value.value + props.step, props.min),
    )
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    setValue(
      value.value === null
        ? finiteMax()
          ? arrowsMax()
          : props.min
        : Math.min(Math.max(value.value - props.step, props.min), arrowsMax()),
    )
  }
}
function select(event: FocusEvent | MouseEvent) {
  ;(event.target as HTMLInputElement).select()
}
</script>

<template>
  <input
    v-bind="attrs"
    type="text"
    role="spinbutton"
    :aria-valuemin="props.min"
    :aria-valuemax="finiteMax() ? props.max : undefined"
    :aria-valuenow="value === null ? 0 : value"
    :data-empty="value === null || undefined"
    inputmode="numeric"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readOnly"
    :value="value === null ? '' : padTime(value)"
    @input="change"
    @keydown="keydown"
    @focus="select"
    @click.stop="select"
    @mousedown.stop
    @paste="(event) => emit('paste', event)"
  />
</template>
