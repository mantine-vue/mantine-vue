<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, useProps, useStyles } from '../../../core'
import { useInputWrapperContext } from '../../Input'
import { usePillsInputContext } from '../PillsInput.context'
import type { PillsInputFieldOwnProps } from './PillsInputField.types'
import classes from '../PillsInput.module.css'

defineOptions({
  name: 'PillsInputField',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<PillsInputFieldOwnProps>(), {
  type: 'visible',
  pointer: false,
  disabled: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const attrs = useAttrs()
const props = useProps('PillsInputField', null, rawProps)

const [value, setValue] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const context = usePillsInputContext()
const inputWrapperContext = useInputWrapperContext()

const getStyles = useStyles({
  name: 'PillsInputField',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
})

const disabled = computed(() => props.disabled || context?.disabled)

const fieldStyles = computed(() =>
  getStyles('field', { className: attrs.class, style: attrs.style as any }),
)

/** The parent `PillsInput` focuses this element when its root is clicked. */
function setFieldRef(node: any) {
  const input = node?.$el ?? node ?? null

  if (context) {
    context.fieldRef.value = input
  }

  assignRef(props.inputRef, input)
}

function onInput(event: Event) {
  ;(attrs.onInput as ((event: Event) => void) | undefined)?.(event)
  setValue((event.currentTarget as HTMLInputElement).value)
}

/** Keeps a click on the field from reaching the root, which would refocus it. */
function onMousedown(event: MouseEvent) {
  if (!props.pointer) {
    event.stopPropagation()
  }
}

/**
 * `onInput` is invoked explicitly above, so the fallthrough copy is dropped to keep
 * Vue from calling a consumer handler twice.
 */
const forwardedAttrs = computed(() => omitAttrs(attrs, ['onInput']))
</script>

<template>
  <Box
    :ref="setFieldRef"
    v-bind="{ ...forwardedAttrs, ...fieldStyles }"
    component="input"
    type="text"
    :value="value"
    :data-type="props.type"
    :disabled="disabled"
    :mod="[{ disabled, pointer: props.pointer }, props.mod]"
    :id="inputWrapperContext.inputId || props.id"
    :aria-invalid="context?.hasError || undefined"
    :aria-describedby="inputWrapperContext.describedBy"
    @input="onInput"
    @mousedown="onMousedown"
  />
</template>
