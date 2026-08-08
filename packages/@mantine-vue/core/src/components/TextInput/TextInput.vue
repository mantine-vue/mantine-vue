<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import { InputBase } from '../InputBase'
import type { TextInputOwnProps, TextInputSlots } from './TextInput.types'

defineOptions({
  name: 'TextInput',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextInputOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

defineSlots<TextInputSlots>()

const slots = useSlots()
const attrs = useAttrs()
</script>

<template>
  <InputBase
    v-bind="attrs"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    component="input"
    __static-selector="TextInput"
    :__styles-api-props="attrs"
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
