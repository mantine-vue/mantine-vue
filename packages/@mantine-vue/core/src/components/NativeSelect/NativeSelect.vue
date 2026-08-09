<script lang="ts">
const defaultProps = { size: 'sm', rightSectionPointerEvents: 'none' } as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue'
import { useProps } from '../../core'
import { InputBase } from '../InputBase'
import { getParsedNativeSelectData } from './get-parsed-data/get-parsed-data'
import { NativeSelectOption } from './NativeSelectOption'
import NativeSelectChevron from './NativeSelectChevron.vue'
import type { NativeSelectOwnProps, NativeSelectSlots } from './NativeSelect.types'

defineOptions({
  name: 'NativeSelect',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<NativeSelectOwnProps>(), {
  error: undefined,
  rightSection: undefined,
  label: undefined,
  description: undefined,
  required: false,
  disabled: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

defineSlots<NativeSelectSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('NativeSelect', defaultProps, rawProps)

/**
 * `option` and `optgroup` trees are built with `h` because they are generated from
 * data, not written in the template.
 */
const parsedOptions = computed(() =>
  getParsedNativeSelectData(props.data).map((item, index) =>
    h(NativeSelectOption, { key: index, data: item }),
  ),
)

const renderOptions = () => parsedOptions.value

/**
 * A consumer-supplied right section replaces the default chevron. The fallback is a
 * VNode rather than the component itself: `Input` renders section content directly and
 * only calls it when it is a function, so passing the component object would render
 * nothing useful.
 */
const rightSection = computed(() =>
  props.rightSection !== undefined || slots.rightSection
    ? props.rightSection
    : h(NativeSelectChevron),
)
</script>

<template>
  <InputBase
    v-bind="attrs"
    component="select"
    __static-selector="NativeSelect"
    :size="props.size"
    :pointer="true"
    :error="props.error"
    :unstyled="props.unstyled"
    :right-section="rightSection"
    :right-section-pointer-events="props.rightSectionPointerEvents"
    :label="props.label"
    :description="props.description"
    :required="props.required"
    :disabled="props.disabled"
    :id="props.id"
    :name="props.name"
    :form="props.form"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :variant="props.variant"
    :radius="props.radius"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  >
    <template #default>
      <slot v-if="slots.default" />
      <component :is="renderOptions" v-else />
    </template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>
    <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
  </InputBase>
</template>
