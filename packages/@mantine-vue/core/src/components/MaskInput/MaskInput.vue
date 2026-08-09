<script lang="ts">
/** A cloned child may already carry an array of handlers for the same event. */
function callHandler(handler: unknown, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else if (typeof handler === 'function') {
    handler(event)
  }
}

export { callHandler }
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { InputBase } from '../InputBase'
import {
  applyMaskToRaw,
  buildDisplayValue,
  extractRaw,
  isComplete,
  nextToken,
  previousToken,
  processInput,
  resolveMaskOptions,
  type MaskInputState,
} from './use-mask-input'
import type { MaskInputProps, MaskInputSlots } from './MaskInput.types'

defineOptions({
  name: 'MaskInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MaskInputProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  separate: false,
  slotChar: '_',
  alwaysShowMask: false,
  showMaskOnFocus: true,
  autoClear: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'change-raw': [raw: string, display: string]
  complete: [display: string, raw: string]
}>()

defineSlots<MaskInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const input = ref<HTMLInputElement | null>(null)
const processed = ref('')
const rawValue = ref('')
const displayValue = ref('')
const focused = ref(false)
const wasComplete = ref(false)

const options = () => ({
  mask: props.mask,
  tokens: props.tokens,
  modify: props.modify,
  separate: props.separate,
  slotChar: props.slotChar,
  transform: props.transform,
})

const selection = (element = input.value): MaskInputState['selection'] =>
  element ? { start: element.selectionStart ?? 0, end: element.selectionEnd ?? 0 } : null

/**
 * Applies a masked string, resolving the mask twice: `modify` can change the mask based
 * on the raw value, and the raw value is only known after a first pass.
 */
const commit = (masked: string, cursor?: number, notify = true, currentValue?: string) => {
  const initial = resolveMaskOptions(options(), rawValue.value)
  const nextProcessed = processInput(masked, initial.slots, initial.transform)
  const nextRaw = extractRaw(nextProcessed, initial.slots)
  const resolved = resolveMaskOptions(options(), nextRaw)
  const reprocessed = processInput(masked, resolved.slots, resolved.transform)
  const resolvedRaw = extractRaw(reprocessed, resolved.slots)
  const showSlots = props.alwaysShowMask || (focused.value && props.showMaskOnFocus)
  let nextDisplay = buildDisplayValue(reprocessed, resolved.slots, resolved.slotChar, showSlots)
  let nextSelection = cursor === undefined ? selection() : { start: cursor, end: cursor }

  if (props.beforeMaskedStateChange) {
    const changed = props.beforeMaskedStateChange({
      previousState: { value: displayValue.value, selection: selection() },
      currentState: {
        value: currentValue ?? input.value?.value ?? displayValue.value,
        selection: selection(),
      },
      nextState: { value: nextDisplay, selection: nextSelection },
    })
    nextDisplay = changed.value
    nextSelection = changed.selection
  }

  processed.value = reprocessed
  rawValue.value = resolvedRaw
  displayValue.value = nextDisplay
  if (input.value) {
    input.value.value = nextDisplay
    if (nextSelection && document.activeElement === input.value) {
      const position = Math.min(nextSelection.start, reprocessed.length)
      input.value.setSelectionRange(position, Math.min(nextSelection.end, reprocessed.length))
    }
  }

  const complete = isComplete(reprocessed, resolved.slots)
  if (notify) {
    emit('update:modelValue', nextDisplay)
    emit('change', nextDisplay)
    emit('change-raw', resolvedRaw, nextDisplay)
    if (complete && !wasComplete.value) {
      emit('complete', nextDisplay, resolvedRaw)
    }
  }
  wasComplete.value = complete
}

const reset = () => {
  processed.value = ''
  rawValue.value = ''
  wasComplete.value = false
  const resolved = resolveMaskOptions(options(), '')
  displayValue.value = props.alwaysShowMask
    ? buildDisplayValue('', resolved.slots, resolved.slotChar, true)
    : ''
  if (input.value) {
    input.value.value = displayValue.value
  }
  emit('update:modelValue', '')
  emit('change', '')
  emit('change-raw', '', '')
}

assignRef(props.resetRef, reset)
watch(
  () => props.resetRef,
  (value) => assignRef(value, reset),
)
watch(
  () => props.modelValue,
  (value) => {
    if (input.value && value !== undefined && String(value) !== displayValue.value) {
      commit(String(value), undefined, false, String(value))
    }
  },
)
onBeforeUnmount(() => assignRef(props.resetRef, null))

/** `InputBase` renders a wrapper, so the element to mask is the inner input. */
const attach = (root: any) => {
  const element = (root?.$el ?? root)?.querySelector?.('input') ?? root?.$el ?? root
  input.value = element instanceof HTMLInputElement ? element : null
  assignRef((attrs as any).rootRef, root?.$el ?? root ?? null)

  if (!input.value) {
    return
  }

  const initial = props.modelValue ?? props.defaultValue ?? input.value.value
  if (initial) {
    commit(String(initial), undefined, false, String(initial))
  } else if (props.alwaysShowMask) {
    const resolved = resolveMaskOptions(options(), '')
    displayValue.value = buildDisplayValue('', resolved.slots, resolved.slotChar, true)
    input.value.value = displayValue.value
  }
}

/**
 * The browser has already edited the value, so what the user did is recovered by
 * diffing: the common prefix and suffix are unchanged, everything between them is the
 * insertion. This handles autofill and drag-and-drop, which produce no key events.
 */
const handleInput = (event: Event) => {
  const element = event.currentTarget as HTMLInputElement
  const previous = displayValue.value
  const current = element.value
  let prefix = 0
  while (
    prefix < previous.length &&
    prefix < current.length &&
    previous[prefix] === current[prefix]
  )
    prefix++
  let suffix = 0
  while (
    suffix < previous.length - prefix &&
    suffix < current.length - prefix &&
    previous[previous.length - 1 - suffix] === current[current.length - 1 - suffix]
  )
    suffix++

  const resolved = resolveMaskOptions(options(), rawValue.value)
  const removedEnd = previous.length - suffix
  const before = extractRaw(previous.slice(0, prefix), resolved.slots.slice(0, prefix))
  const after = extractRaw(previous.slice(removedEnd), resolved.slots.slice(removedEnd))
  const inserted = current.slice(prefix, current.length - suffix)
  const next = applyMaskToRaw(before + inserted + after, resolved.slots, resolved.transform)
  const maskedPrefix = applyMaskToRaw(before + inserted, resolved.slots, resolved.transform)
  commit(next, maskedPrefix.length, true, current)
  callHandler((attrs as any).onInput, event)
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  const resolved = resolveMaskOptions(options(), rawValue.value)
  if (props.showMaskOnFocus || props.alwaysShowMask) {
    displayValue.value = buildDisplayValue(processed.value, resolved.slots, resolved.slotChar, true)
    ;(event.currentTarget as HTMLInputElement).value = displayValue.value
  }
  requestAnimationFrame(() => {
    const start = nextToken(resolved.slots, 0)
    const end = processed.value.length || start
    const element = event.currentTarget as HTMLInputElement
    if (
      document.activeElement === element &&
      ((element.selectionStart ?? 0) < start || (element.selectionStart ?? 0) > end)
    ) {
      element.setSelectionRange(end, end)
    }
  })
  callHandler((attrs as any).onFocus, event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  const resolved = resolveMaskOptions(options(), rawValue.value)
  const complete = isComplete(processed.value, resolved.slots)
  if (props.autoClear && !complete && rawValue.value) {
    reset()
  } else if (!props.alwaysShowMask) {
    displayValue.value = rawValue.value ? processed.value : ''
    ;(event.currentTarget as HTMLInputElement).value = displayValue.value
  }
  callHandler((attrs as any).onBlur, event)
  callHandler((attrs as any).onChange, event)
}

const handleKeydown = (event: KeyboardEvent) => {
  const element = event.currentTarget as HTMLInputElement
  const resolved = resolveMaskOptions(options(), rawValue.value)
  const start = element.selectionStart ?? 0
  const end = element.selectionEnd ?? start

  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    let deleteStart = start
    let deleteEnd = end
    if (start === end) {
      const token =
        event.key === 'Backspace'
          ? previousToken(resolved.slots, start - 1)
          : nextToken(resolved.slots, start)
      if (token < 0 || token >= processed.value.length) return
      deleteStart = token
      deleteEnd = token + 1
    }
    const before = extractRaw(
      processed.value.slice(0, deleteStart),
      resolved.slots.slice(0, deleteStart),
    )
    const after = extractRaw(processed.value.slice(deleteEnd), resolved.slots.slice(deleteEnd))
    commit(applyMaskToRaw(before + after, resolved.slots, resolved.transform), deleteStart)
  } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    const position = nextToken(resolved.slots, Math.min(start, processed.value.length))
    if (position >= resolved.slots.length) return
    const character = resolved.transform ? resolved.transform(event.key) : event.key
    resolved.slots[position].pattern!.lastIndex = 0
    if (!resolved.slots[position].pattern!.test(character)) return
    const before = extractRaw(processed.value.slice(0, position), resolved.slots.slice(0, position))
    const after = extractRaw(processed.value.slice(end), resolved.slots.slice(end))
    const next = applyMaskToRaw(before + character + after, resolved.slots, resolved.transform)
    commit(next, nextToken(resolved.slots, position + 1))
  }
  callHandler((attrs as any).onKeydown, event)
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const element = event.currentTarget as HTMLInputElement
  const resolved = resolveMaskOptions(options(), rawValue.value)
  const start = Math.min(element.selectionStart ?? 0, processed.value.length)
  const end = Math.min(element.selectionEnd ?? start, processed.value.length)
  const before = extractRaw(processed.value.slice(0, start), resolved.slots.slice(0, start))
  const after = extractRaw(processed.value.slice(end), resolved.slots.slice(end))
  const pasted = event.clipboardData?.getData('text') ?? ''
  const next = applyMaskToRaw(before + pasted + after, resolved.slots, resolved.transform)
  const pasteEnd = applyMaskToRaw(before + pasted, resolved.slots, resolved.transform).length
  commit(next, pasteEnd)
  callHandler((attrs as any).onPaste, event)
}

/**
 * Every handler below is chained explicitly, and these are consumed here, so none of
 * them may also reach `InputBase` through the fallthrough attributes.
 */
const forwarded = computed(() => {
  const result = { ...attrs } as Record<string, any>
  delete result.rootRef
  delete result.onInput
  delete result.onFocus
  delete result.onBlur
  delete result.onChange
  delete result.onKeydown
  delete result.onPaste
  delete result.value
  delete result.defaultValue
  return result
})

const inputType = computed(() => (attrs as any).type ?? 'text')
</script>

<template>
  <InputBase
    v-bind="forwarded"
    component="input"
    :type="inputType"
    __static-selector="MaskInput"
    :__styles-api-props="attrs"
    :model-value="displayValue"
    :root-ref="attach"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @paste="handlePaste"
  >
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
