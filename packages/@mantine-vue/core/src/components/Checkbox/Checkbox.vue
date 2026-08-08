<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getSize,
  getThemeColor,
} from '../../core'
import { InlineInputClasses } from '../../utils'
import classes from './Checkbox.module.css'

const mergedClasses = { ...InlineInputClasses, ...classes }

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, autoContrast }) => ({
    root: {
      '--checkbox-size': getSize(size, 'checkbox-size'),
      '--checkbox-radius': radius === undefined ? undefined : getRadius(radius),
      '--checkbox-color': getThemeColor(color, theme),
      '--checkbox-icon-color': iconColor
        ? getThemeColor(iconColor, theme)
        : getAutoContrastValue(autoContrast, theme)
          ? getContrastColor({ color, theme, autoContrast })
          : undefined,
    },
  }),
)

/**
 * `size` is deliberately absent: `useProps` would fill it in before the parent
 * group is consulted, and the group fallback could never apply. It is applied as
 * `DEFAULT_SIZE` only after both the prop and the group have been checked.
 */
const DEFAULT_SIZE = 'sm'

const defaultProps = {
  labelPosition: 'right',
  radius: 'sm',
  variant: 'filled',
  withErrorStyles: true,
} as const

/** Fallthrough listeners arrive as a handler or an array of handlers. */
function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((item) => item?.(event))
  } else {
    handler?.(event)
  }
}

export { mergedClasses, varsResolver, defaultProps, DEFAULT_SIZE }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, resolveNode, useProps, useStyles } from '../../core'
import { InlineInput } from '../../utils'
import { CheckboxIcon } from './CheckIcon'
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroup'
import type { CheckboxOwnProps, CheckboxSlots } from './Checkbox.types'

defineOptions({
  name: 'Checkbox',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CheckboxOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  modelValue: undefined,
  checked: undefined,
  defaultChecked: undefined,
  autoContrast: undefined,
  withErrorStyles: undefined,
  indeterminate: false,
  disabled: false,
  readOnly: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

defineSlots<CheckboxSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Checkbox', defaultProps, rawProps)

const uuid = useId(props.id)
const groupContext = useCheckboxGroupContext()

const [localChecked, setLocalChecked] = useUncontrolled<boolean>({
  value: () => (props.modelValue !== undefined ? props.modelValue : props.checked),
  defaultValue: props.defaultChecked,
  finalValue: false,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('update:checked', value)
    emit('change', value)
  },
})

const getStyles = useStyles({
  name: 'Checkbox',
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

const id = computed(() => uuid.value || props.id || '')

const label = computed(() => resolveNode(props.label, slots.label))
const description = computed(() => resolveNode(props.description, slots.description))
const error = computed(() => resolveNode(props.error, slots.error))

const describedBy = computed(() => {
  const descriptionId = description.value ? `${id.value}-description` : undefined
  const errorId = error.value && typeof error.value !== 'boolean' ? `${id.value}-error` : undefined

  return [descriptionId, errorId, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined
})

const value = computed(() => String(attrs.value ?? ''))
const checked = computed(() =>
  groupContext ? groupContext.value.includes(value.value) : localChecked.value,
)
const disabled = computed(() => groupContext?.isDisabled?.(value.value) || props.disabled)

const size = computed(() => props.size ?? groupContext?.size ?? DEFAULT_SIZE)

const iconStyles = computed(() => getStyles('icon'))
const iconSlotProps = computed(() => ({ indeterminate: props.indeterminate, ...iconStyles.value }))
const IconComponent = computed(() => props.icon || CheckboxIcon)

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

function onInputClick(event: MouseEvent) {
  callHandler((attrs as any).onClick, event)

  if (props.readOnly) {
    event.preventDefault()
  }
}

function onInputChange(event: Event) {
  if (props.readOnly) {
    return
  }

  const nextChecked = (event.currentTarget as HTMLInputElement).checked
  groupContext?.onChange(event)
  setLocalChecked(nextChecked)
}

/**
 * The input receives the fallthrough attributes, so consumer `onClick` / `onChange`
 * handlers would be merged with the ones below and fire twice. `onClick` is forwarded
 * explicitly by `onInputClick`; `onChange` reaches the consumer through
 * `useUncontrolled`.
 */
const inputAttrs = computed(() => omitAttrs(attrs, ['onClick', 'onChange']))
</script>

<template>
  <InlineInput
    :ref="setRootRef"
    v-bind="{
      ...props.wrapperProps,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    __static-selector="Checkbox"
    :__styles-api-props="props"
    :id="id"
    :size="size"
    :label-position="props.labelPosition"
    :label="label"
    :description="description"
    :error="error"
    :disabled="disabled"
    :class-names="props.classNames"
    :styles="props.styles"
    :unstyled="props.unstyled"
    :data-checked="checked || undefined"
    :variant="props.variant"
    :mod="props.mod"
  >
    <Box v-bind="getStyles('inner')" :mod="{ labelPosition: props.labelPosition }">
      <Box
        v-bind="{ ...inputAttrs, ...getStyles('input', { style: undefined }) }"
        component="input"
        type="checkbox"
        :id="id"
        :checked="props.indeterminate ? false : checked"
        :disabled="disabled"
        :readonly="props.readOnly"
        :aria-describedby="describedBy"
        :data-indeterminate="props.indeterminate || undefined"
        :mod="{ error: Boolean(error), withErrorStyles: props.withErrorStyles }"
        :variant="props.variant"
        @click="onInputClick"
        @change="onInputChange"
      />

      <slot name="icon" v-bind="iconSlotProps">
        <component :is="IconComponent" v-bind="iconStyles" :indeterminate="props.indeterminate" />
      </slot>
    </Box>
  </InlineInput>
</template>
