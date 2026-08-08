<script lang="ts">
/** Fallthrough listeners arrive as a handler or an array of handlers. */
function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

export { callHandler }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { omitAttrs } from '../../core'
import { Textarea } from '../Textarea'
import { validateJson } from './validate-json/validate-json'
import type { JsonInputOwnProps, JsonInputSlots } from './JsonInput.types'

defineOptions({
  name: 'JsonInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<JsonInputOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  formatOnBlur: false,
  validationError: undefined,
  error: undefined,
  // `serialize` / `deserialize` are deliberately absent: Vue treats a function passed
  // as a prop default as a *factory* and calls it with the props object, so
  // `deserialize: JSON.parse` would run `JSON.parse(props)` during prop resolution.
  // They are defaulted below instead.
  serialize: undefined,
  deserialize: undefined,
  indentSpaces: 2,
  readOnly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

defineSlots<JsonInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const [value, setValue] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const serialize = computed(() => props.serialize ?? JSON.stringify)
const deserialize = computed(() => props.deserialize ?? JSON.parse)

const valid = ref(validateJson(value.value, deserialize.value))

/** While the JSON is invalid the validation message replaces the regular error. */
const error = computed(() => (valid.value ? props.error : props.validationError || true))

function onInput(event: Event) {
  callHandler(attrs.onInput, event)
  setValue((event.currentTarget as HTMLTextAreaElement).value)
}

function onFocus(event: FocusEvent) {
  callHandler(attrs.onFocus, event)
  valid.value = true
}

function onBlur(event: FocusEvent) {
  callHandler(attrs.onBlur, event)

  const target = event.currentTarget as HTMLTextAreaElement
  const isValid = validateJson(target.value, deserialize.value)

  if (props.formatOnBlur && !props.readOnly && isValid && target.value.trim() !== '') {
    setValue(serialize.value(deserialize.value(target.value), null, props.indentSpaces))
  }

  valid.value = isValid
}

/**
 * The handlers above already invoke the consumer's listeners, so the fallthrough
 * copies are dropped to keep Vue from calling them a second time.
 */
const forwardedAttrs = computed(() => omitAttrs(attrs, ['onInput', 'onFocus', 'onBlur']))
</script>

<template>
  <Textarea
    v-bind="forwardedAttrs"
    :model-value="value"
    :read-only="props.readOnly"
    autocomplete="off"
    __static-selector="JsonInput"
    :error="error"
    :data-monospace="true"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template v-if="slots.default" #default><slot /></template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
    <template v-if="slots.bottomSection" #bottomSection><slot name="bottomSection" /></template>
  </Textarea>
</template>
