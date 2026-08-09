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
import classes from './Radio.module.css'

const mergedClasses = { ...InlineInputClasses, ...classes }

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, color, iconColor, autoContrast }) => ({
    root: {
      '--radio-size': getSize(size, 'radio-size'),
      '--radio-radius': radius === undefined ? undefined : getRadius(radius),
      '--radio-color': getThemeColor(color, theme),
      '--radio-icon-color': iconColor
        ? getThemeColor(iconColor, theme)
        : getAutoContrastValue(autoContrast, theme)
          ? getContrastColor({ color, theme, autoContrast })
          : undefined,
      '--radio-icon-size': getSize(size, 'radio-icon-size'),
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
  radius: 'xl',
  variant: 'filled',
  withErrorStyles: true,
} as const

export { mergedClasses, varsResolver, defaultProps, DEFAULT_SIZE }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, resolveNode, useProps, useStyles } from '../../core'
import { InlineInput } from '../../utils'
import { RadioIcon } from './RadioIcon'
import { useRadioGroupContext } from './RadioGroup/RadioGroup'
import type { RadioOwnProps, RadioSlots } from './Radio.types'

defineOptions({
  name: 'Radio',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<RadioOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  modelValue: undefined,
  checked: undefined,
  defaultChecked: undefined,
  autoContrast: undefined,
  withErrorStyles: undefined,
  disabled: false,
  readOnly: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

defineSlots<RadioSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Radio', defaultProps, rawProps)

const uuid = useId(props.id)
const groupContext = useRadioGroupContext()

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
  name: 'Radio',
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
  groupContext ? groupContext.value === value.value : localChecked.value,
)
const disabled = computed(() => groupContext?.disabled || props.disabled)
const name = computed(() => groupContext?.name ?? attrs.name)

const size = computed(() => props.size ?? groupContext?.size ?? DEFAULT_SIZE)

const iconStyles = computed(() => getStyles('icon'))
const IconComponent = computed(() => props.icon || RadioIcon)

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

function onInputChange(event: Event) {
  if (props.readOnly) {
    ;(event.currentTarget as HTMLInputElement).checked = Boolean(checked.value)
    return
  }

  groupContext?.onChange(event)
  setLocalChecked((event.currentTarget as HTMLInputElement).checked)
}

/**
 * The input receives the fallthrough attributes, so a consumer `onChange` would be
 * merged with the handler below and fire twice. It reaches the consumer through
 * `useUncontrolled` instead.
 */
const inputAttrs = computed(() => omitAttrs(attrs, ['onChange']))
</script>

<template>
  <InlineInput
    :ref="setRootRef"
    v-bind="{
      ...props.wrapperProps,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    __static-selector="Radio"
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
        v-bind="{ ...inputAttrs, ...getStyles('radio') }"
        component="input"
        type="radio"
        :id="id"
        :checked="checked"
        :disabled="disabled"
        :readonly="props.readOnly"
        :name="name"
        :aria-describedby="describedBy"
        :mod="{ error: Boolean(error), withErrorStyles: props.withErrorStyles }"
        :variant="props.variant"
        @change="onInputChange"
      />

      <slot name="icon" v-bind="iconStyles">
        <component :is="IconComponent" v-bind="iconStyles" />
      </slot>
    </Box>
  </InlineInput>
</template>
