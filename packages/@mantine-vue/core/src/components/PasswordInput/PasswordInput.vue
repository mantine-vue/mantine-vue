<script lang="ts">
import { createVarsResolver, getSize } from '../../core'
import inputClasses from '../Input/Input.module.css'
import classes from './PasswordInput.module.css'

const mergedClasses = { ...inputClasses, ...classes }

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: {
    '--psi-icon-size': getSize(size, 'psi-icon-size'),
    '--psi-button-size': getSize(size, 'psi-button-size'),
  },
}))

const defaultProps = { variant: 'default', size: 'sm' } as const

export { mergedClasses, varsResolver, defaultProps }
</script>

<script setup lang="ts">
import { computed, h, ref, useAttrs, useSlots } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { omitAttrs, useProps, useStyles } from '../../core'
import { ActionIcon } from '../ActionIcon'
import { Input } from '../Input'
import { PasswordToggleIcon } from './PasswordToggleIcon'
import type { PasswordInputOwnProps, PasswordInputSlots } from './PasswordInput.types'

defineOptions({
  name: 'PasswordInput',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<PasswordInputOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  leftSection: undefined,
  rightSection: undefined,
  // Tri-state: `undefined` means uncontrolled visibility.
  visible: undefined,
  defaultVisible: undefined,
  required: false,
  // Tri-state: `undefined` inherits `required`.
  withAsterisk: undefined,
  disabled: false,
  withErrorStyles: true,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:visible': [visible: boolean]
  change: [value: string]
}>()

defineSlots<PasswordInputSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('PasswordInput', defaultProps, rawProps)

const uuid = useId(props.id)
const fallbackId = ref(`password-input-${Math.random().toString(36).slice(2)}`)

const [visible, setVisible] = useUncontrolled<boolean>({
  value: () => props.visible,
  defaultValue: props.defaultVisible,
  finalValue: false,
  onChange: (value) => emit('update:visible', value),
})

const [value, setValue] = useUncontrolled<string>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const getStyles = useStyles({
  name: 'PasswordInput',
  props,
  classes: mergedClasses,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

function toggleVisibility() {
  setVisible(!visible.value)
}

const id = computed(() => uuid.value || fallbackId.value)
const errorId = computed(() => props.errorProps?.id || `${id.value}-error`)
const descriptionId = computed(() => props.descriptionProps?.id || `${id.value}-description`)

const hasError = computed(() =>
  props.error !== undefined
    ? Boolean(props.error) && typeof props.error !== 'boolean'
    : Boolean(slots.error),
)
const hasDescription = computed(() =>
  props.description !== undefined ? props.description !== null : Boolean(slots.description),
)
const describedBy = computed(
  () =>
    `${hasError.value ? errorId.value : ''} ${hasDescription.value ? descriptionId.value : ''}`.trim() ||
    undefined,
)

/** Stable functional component: the icon may come from a slot, a prop or the default. */
const renderVisibilityToggleIcon = () => {
  if (slots.visibilityToggleIcon) {
    return slots.visibilityToggleIcon({ reveal: visible.value })
  }

  if (props.visibilityToggleIcon) {
    return h(props.visibilityToggleIcon, { reveal: visible.value })
  }

  return h(PasswordToggleIcon, { reveal: visible.value })
}

/**
 * Built as a VNode because it is handed to `Input` as the `rightSection` *content*,
 * not rendered in this template.
 */
const visibilityToggleButton = computed(() =>
  h(
    ActionIcon,
    {
      ...getStyles('visibilityToggle'),
      ...props.visibilityToggleButtonProps,
      disabled: props.disabled,
      radius: props.radius,
      'aria-pressed': visible.value,
      tabIndex: -1,
      'aria-label':
        props.visibilityToggleButtonProps?.['aria-label'] || 'Toggle password visibility',
      variant: props.visibilityToggleButtonProps?.variant ?? 'subtle',
      color: 'gray',
      unstyled: props.unstyled,
      onTouchend: (event: TouchEvent) => {
        event.preventDefault()
        props.visibilityToggleButtonProps?.onTouchend?.(event)
        toggleVisibility()
      },
      onMousedown: (event: MouseEvent) => {
        event.preventDefault()
        props.visibilityToggleButtonProps?.onMousedown?.(event)
        toggleVisibility()
      },
      onKeydown: (event: KeyboardEvent) => {
        props.visibilityToggleButtonProps?.onKeydown?.(event)

        if (event.key === ' ') {
          event.preventDefault()
          toggleVisibility()
        }
      },
    },
    renderVisibilityToggleIcon,
  ),
)

const inputClassNames = computed(() => ({
  ...(props.classNames as any),
  input: [classes.input, (props.classNames as any)?.input].filter(Boolean).join(' '),
}))

/** A consumer-supplied right section replaces the visibility toggle entirely. */
const rightSection = computed(() =>
  props.rightSection !== undefined || slots.rightSection
    ? props.rightSection
    : visibilityToggleButton.value,
)

function onInput(event: Event) {
  ;(attrs.onInput as ((event: Event) => void) | undefined)?.(event)
  setValue((event.currentTarget as HTMLInputElement).value)
}

/**
 * `onInput` is invoked explicitly above, so the fallthrough copy is dropped to keep
 * Vue from calling a consumer handler twice.
 */
const innerInputAttrs = computed(() => omitAttrs(attrs, ['onInput']))
</script>

<template>
  <Input.Wrapper
    v-bind="{
      ...props.wrapperProps,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :id="id"
    :label="props.label"
    :description="props.description"
    :error="props.error"
    :required="props.required"
    :with-asterisk="props.withAsterisk"
    :label-props="{ ...props.labelProps, htmlFor: id }"
    :description-props="{ ...props.descriptionProps, id: descriptionId }"
    :error-props="{ ...props.errorProps, id: errorId }"
    :input-container="props.inputContainer"
    :input-wrapper-order="props.inputWrapperOrder"
    :size="props.size"
    :variant="props.variant"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
  >
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.error" #error><slot name="error" /></template>

    <template #default>
      <Input
        component="div"
        :dir="attrs.dir as any"
        :error="props.error ?? (slots.error ? true : undefined)"
        :left-section="props.leftSection"
        :size="props.size"
        :class-names="inputClassNames"
        :styles="props.styles"
        :radius="props.radius"
        :disabled="props.disabled"
        __static-selector="PasswordInput"
        :__styles-api-props="props"
        :right-section-width="props.rightSectionWidth"
        :right-section="rightSection"
        :variant="props.variant"
        :unstyled="props.unstyled"
        :left-section-width="props.leftSectionWidth"
        :right-section-pointer-events="props.rightSectionPointerEvents || 'all'"
        :right-section-props="props.rightSectionProps"
        :left-section-props="props.leftSectionProps"
        :left-section-pointer-events="props.leftSectionPointerEvents"
        :with-aria="false"
        :with-error-styles="props.withErrorStyles"
      >
        <template #default>
          <input
            v-bind="{ ...innerInputAttrs, ...getStyles('innerInput') }"
            :value="value"
            :required="props.required"
            :data-invalid="props.error || slots.error ? true : undefined"
            :data-with-left-section="
              props.leftSection !== undefined || slots.leftSection ? true : undefined
            "
            :disabled="props.disabled"
            :id="id"
            :aria-describedby="describedBy"
            :autocomplete="(attrs.autocomplete as any) || 'off'"
            :type="visible ? 'text' : 'password'"
            @input="onInput"
          />
        </template>
        <template v-if="slots.leftSection" #leftSection><slot name="leftSection" /></template>
        <template v-if="slots.rightSection" #rightSection><slot name="rightSection" /></template>
      </Input>
    </template>
  </Input.Wrapper>
</template>
