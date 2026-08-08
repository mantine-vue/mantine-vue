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
import { omitAttrs } from '../../core'
import { InputBase } from '../InputBase'
import { providePillsInputContext } from './PillsInput.context'
import type { PillsInputOwnProps, PillsInputSlots } from './PillsInput.types'

defineOptions({
  name: 'PillsInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PillsInputOwnProps>(), {
  size: 'sm',
  disabled: false,
  error: undefined,
  label: undefined,
  description: undefined,
  variant: 'default',
  required: false,
  // Tri-state: `undefined` inherits `required`.
  withAsterisk: undefined,
  unstyled: false,
})

defineSlots<PillsInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const fieldRef = ref<HTMLInputElement | null>(null)

/** Getters keep the provided object reactive without changing the shape consumers read. */
providePillsInputContext({
  fieldRef,
  get size() {
    return props.size
  },
  get disabled() {
    return props.disabled
  },
  get hasError() {
    return Boolean(props.error)
  },
  get variant() {
    return props.variant
  },
})

function focusField() {
  fieldRef.value?.focus()
}

/** Clicking anywhere in the input focuses the field, as if it filled the whole box. */
function onMousedown(event: MouseEvent) {
  event.preventDefault()
  focusField()
  callHandler((attrs as any).onMousedown ?? (attrs as any).onMouseDown, event)
}

function onClick(event: MouseEvent) {
  event.preventDefault()

  const fieldset = (event.currentTarget as HTMLElement).closest(
    'fieldset',
  ) as HTMLFieldSetElement | null

  if (!fieldset?.disabled) {
    focusField()
    callHandler((attrs as any).onClick, event)
  }
}

/**
 * The handlers above already invoke the consumer's listeners, so the fallthrough
 * copies are dropped to keep Vue from calling them a second time.
 */
const forwardedAttrs = computed(() => omitAttrs(attrs, ['onMousedown', 'onMouseDown', 'onClick']))
</script>

<template>
  <InputBase
    v-bind="forwardedAttrs"
    :size="props.size"
    :error="props.error"
    :variant="props.variant"
    component="div"
    :data-no-overflow="true"
    multiline
    :disabled="props.disabled"
    :__static-selector="props.__staticSelector || 'PillsInput'"
    :__styles-api-props="props.__stylesApiProps"
    :with-aria="false"
    :label="props.label"
    :description="props.description"
    :required="props.required"
    :with-asterisk="props.withAsterisk"
    :wrapper-props="props.wrapperProps"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
    :radius="props.radius"
    :mod="props.mod"
    @mousedown="onMousedown"
    @click="onClick"
  >
    <template #default><slot /></template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
