<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { resolveNode, useMantineEnv, useProps } from '../../core'
import { InputBase } from '../InputBase'
import { TextareaAutosize } from './Autosize'
import type { TextareaOwnProps, TextareaSlots } from './Textarea.types'

defineOptions({
  name: 'Textarea',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<TextareaOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  autosize: false,
  maxRows: undefined,
  minRows: undefined,
  resize: undefined,
  // Intentionally undefined to preserve downstream defaults.
  bottomSection: undefined,
  bottomSectionProps: undefined,
  __staticSelector: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

defineSlots<TextareaSlots>()

const slots = useSlots()
const attrs = useAttrs()
const env = useMantineEnv()

const props = useProps(['Input', 'InputWrapper', 'Textarea'], null, rawProps)

const shouldAutosize = computed(() => props.autosize && env !== 'test')

const autosizeProps = computed(() =>
  shouldAutosize.value
    ? { maxRows: props.maxRows, minRows: props.minRows }
    : // A plain textarea has no `minRows`, but the row count still carries over.
      { rows: props.minRows },
)

const bottomSection = computed(() => resolveNode(props.bottomSection, slots.bottomSection))
</script>

<template>
  <InputBase
    v-bind="{ ...attrs, ...autosizeProps }"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :component="shouldAutosize ? TextareaAutosize : 'textarea'"
    :__static-selector="props.__staticSelector || 'Textarea'"
    multiline
    :data-no-overflow="props.autosize && props.maxRows === undefined ? true : undefined"
    :__bottom-section="bottomSection"
    :__bottom-section-props="props.bottomSectionProps"
    :style="[{ '--input-resize': props.resize }, (attrs as any).style]"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  >
    <template v-if="slots.default" #default><slot /></template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
