<script lang="ts">
const defaultProps = {
  component: 'input',
  __staticSelector: 'InputBase',
  withAria: true,
  size: 'sm',
  labelElement: 'label',
  variant: 'default',
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { STYLE_PROPS_DATA, useProps } from '../../core'
import { Input } from '../Input'
import type { InputBaseOwnProps, InputBaseSlots } from './InputBase.types'

defineOptions({
  name: 'InputBase',
  inheritAttrs: false,
})

/**
 * Every prop whose resolved runtime type includes `Boolean` needs an explicit
 * `undefined` default, or Vue casts an absent prop to `false`.
 *
 * `MantineNode` is in that group: it resolves to `VNodeChild | (() => VNodeChild)`,
 * and `VNodeChild` includes `boolean`. Without the default such a prop arrives
 * downstream as `false`, which `resolveNode` reads as "the prop was provided", so the
 * matching slot is ignored and the child component warns about the prop type.
 *
 * Defaulting to `undefined` keeps the prop optional for callers: Vue only strips
 * `undefined` from a prop's type when the default is a real value.
 */
const rawProps = withDefaults(defineProps<InputBaseOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  leftSection: undefined,
  rightSection: undefined,
  __clearSection: undefined,
  __defaultRightSection: undefined,
  __bottomSection: undefined,
  // Tri-state: `undefined` inherits `required`.
  withAsterisk: undefined,
  // Tri-state: `undefined` lets the theme and `defaultProps` supply `true`.
  withAria: undefined,
  required: false,
  multiline: false,
  __clearable: false,
  disabled: false,
  pointer: false,
  withErrorStyles: true,
  loading: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

defineSlots<InputBaseSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps(['Input', 'InputWrapper', 'InputBase'], defaultProps, rawProps)

const stylePropNames = new Set(Object.keys(STYLE_PROPS_DATA))
const wrapperStyleProps = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => stylePropNames.has(key))),
)
const inputAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key !== 'class' && key !== 'style' && !stylePropNames.has(key),
    ),
  ),
)

const [value, setValue] = useUncontrolled<any>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: undefined,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const wrapperProps = computed(() => ({
  class: attrs.class,
  style: attrs.style,
  ...props.wrapperProps,
  id: props.id,
  label: props.label,
  description: props.description,
  error: props.error,
  required: props.required,
  withAsterisk: props.withAsterisk,
  labelProps: props.labelProps,
  descriptionProps: props.descriptionProps,
  errorProps: props.errorProps,
  inputContainer: props.inputContainer,
  inputWrapperOrder: props.inputWrapperOrder,
  size: props.size,
  labelElement: props.labelElement,
  variant: props.variant,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
  mod: props.mod,
  ...wrapperStyleProps.value,
}))

const inputProps = computed(() => ({
  ...inputAttrs.value,
  component: props.component,
  __staticSelector: props.__staticSelector,
  __stylesApiProps: props.__stylesApiProps ?? props,
  // An `error` slot with no `error` prop still has to switch the input into its error
  // state, so it is collapsed to `true`. Falsy rather than nullish, so that the `false`
  // Vue casts an absent `error` to is treated the same as `undefined`.
  error: props.error || (slots.error ? true : undefined),
  required: props.required,
  id: props.id,
  size: props.size,
  variant: props.variant,
  multiline: props.multiline,
  withAria: props.withAria,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  unstyled: props.unstyled,
  leftSection: props.leftSection,
  leftSectionWidth: props.leftSectionWidth,
  leftSectionProps: props.leftSectionProps,
  leftSectionPointerEvents: props.leftSectionPointerEvents,
  rightSection: props.rightSection,
  rightSectionWidth: props.rightSectionWidth,
  rightSectionProps: props.rightSectionProps,
  rightSectionPointerEvents: props.rightSectionPointerEvents,
  __clearSection: props.__clearSection,
  __clearable: props.__clearable,
  __clearSectionMode: props.__clearSectionMode,
  __defaultRightSection: props.__defaultRightSection,
  radius: props.radius,
  disabled: props.disabled,
  pointer: props.pointer,
  withErrorStyles: props.withErrorStyles,
  inputSize: props.inputSize,
  loading: props.loading,
  loadingPosition: props.loadingPosition,
  __bottomSection: props.__bottomSection,
  __bottomSectionProps: props.__bottomSectionProps,
  rootRef: props.rootRef,
}))
</script>

<template>
  <Input.Wrapper v-bind="wrapperProps">
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>

    <template #default>
      <Input v-bind="inputProps" :model-value="value" @update:model-value="setValue">
        <template v-if="slots.default" #default><slot /></template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </Input>
    </template>
  </Input.Wrapper>
</template>
