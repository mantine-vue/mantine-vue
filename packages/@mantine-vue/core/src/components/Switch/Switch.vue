<script lang="ts">
import { createVarsResolver, getRadius, getSize, getThemeColor } from '../../core'
import { InlineInputClasses } from '../../utils'
import classes from './Switch.module.css'

const mergedClasses = { ...InlineInputClasses, ...classes }

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { radius, color, size }) => ({
  root: {
    '--switch-radius': radius === undefined ? undefined : getRadius(radius),
    '--switch-height': getSize(size, 'switch-height'),
    '--switch-width': getSize(size, 'switch-width'),
    '--switch-thumb-size': getSize(size, 'switch-thumb-size'),
    '--switch-label-font-size': getSize(size, 'switch-label-font-size'),
    '--switch-track-label-padding': getSize(size, 'switch-track-label-padding'),
    '--switch-color': color ? getThemeColor(color, theme) : undefined,
  },
}))

/**
 * `size` is deliberately absent: `useProps` would fill it in before the parent
 * group is consulted, and the group fallback could never apply. It is applied as
 * `DEFAULT_SIZE` only after both the prop and the group have been checked.
 */
const DEFAULT_SIZE = 'sm'

const defaultProps = {
  labelPosition: 'right',
  withThumbIndicator: true,
  radius: 'xl',
} as const

export { mergedClasses, varsResolver, defaultProps, DEFAULT_SIZE }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, resolveNode, useProps, useStyles } from '../../core'
import { InlineInput } from '../../utils'
import { useSwitchGroupContext } from './SwitchGroup/SwitchGroup'
import type { SwitchOwnProps, SwitchSlots } from './Switch.types'

defineOptions({
  name: 'Switch',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<SwitchOwnProps>(), {
  label: undefined,
  offLabel: undefined,
  onLabel: undefined,
  thumbIcon: undefined,
  description: undefined,
  error: undefined,
  modelValue: undefined,
  defaultChecked: undefined,
  withThumbIndicator: undefined,
  disabled: false,
  readOnly: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

defineSlots<SwitchSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Switch', defaultProps, rawProps)

const uuid = useId(props.id)
const groupContext = useSwitchGroupContext()

const [checked, setChecked] = useUncontrolled<boolean>({
  value: () => props.modelValue,
  defaultValue: props.defaultChecked,
  finalValue: false,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('update:checked', value)
    emit('change', value)
  },
})

const getStyles = useStyles({
  name: 'Switch',
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
const thumbIcon = computed(() => resolveNode(props.thumbIcon, slots.thumbIcon))
const onLabel = computed(() => resolveNode(props.onLabel, slots.onLabel))
const offLabel = computed(() => resolveNode(props.offLabel, slots.offLabel))

/** Stable functional component: `MantineNode` values are arbitrary VNode children. */
const renderThumbIcon = () => thumbIcon.value
const renderTrackLabel = () => (currentChecked.value ? onLabel.value : offLabel.value)

const describedBy = computed(() => {
  const descriptionId = description.value ? `${id.value}-description` : undefined
  const errorId = error.value && typeof error.value !== 'boolean' ? `${id.value}-error` : undefined

  return [descriptionId, errorId, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined
})

const value = computed(() => String(attrs.value ?? ''))
const currentChecked = computed(() =>
  groupContext ? groupContext.value.includes(value.value) : checked.value,
)
const disabled = computed(() => groupContext?.isDisabled?.(value.value) || props.disabled)

const size = computed(() => props.size ?? groupContext?.size ?? DEFAULT_SIZE)

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

function onInputChange(event: Event) {
  if (props.readOnly) {
    ;(event.currentTarget as HTMLInputElement).checked = currentChecked.value
    return
  }

  const nextChecked = (event.currentTarget as HTMLInputElement).checked

  if (groupContext) {
    groupContext.onChange(event)
  }

  setChecked(nextChecked)
}

/**
 * The input receives the fallthrough attributes, so a consumer `onChange` would be
 * merged with the handler below and fire twice. It is dropped here and invoked through
 * `useUncontrolled`'s `onChange` instead.
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
    __static-selector="Switch"
    :__styles-api-props="props"
    :id="id"
    :size="size"
    :label-position="props.labelPosition"
    :label="label"
    :description="description"
    :error="error"
    :disabled="disabled"
    body-element="label"
    label-element="span"
    :class-names="props.classNames"
    :styles="props.styles"
    :unstyled="props.unstyled"
    :data-checked="currentChecked || undefined"
    :variant="props.variant"
    :mod="props.mod"
  >
    <input
      v-bind="{ ...inputAttrs, ...getStyles('input') }"
      :id="id"
      type="checkbox"
      role="switch"
      :disabled="disabled"
      :checked="currentChecked"
      :readonly="props.readOnly"
      :aria-describedby="describedBy"
      @change="onInputChange"
    />

    <Box
      component="span"
      aria-hidden="true"
      v-bind="getStyles('track')"
      :mod="{
        error: Boolean(error),
        labelPosition: props.labelPosition,
        withoutLabels: !onLabel && !offLabel,
      }"
    >
      <Box
        component="span"
        v-bind="getStyles('thumb')"
        :mod="{ withThumbIndicator: props.withThumbIndicator && !thumbIcon }"
      >
        <component :is="renderThumbIcon" />
      </Box>

      <span v-bind="getStyles('trackLabel')">
        <component :is="renderTrackLabel" />
      </span>
    </Box>
  </InlineInput>
</template>
