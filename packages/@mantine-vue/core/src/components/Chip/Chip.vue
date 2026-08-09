<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, variant, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--chip-fz': getFontSize(size),
        '--chip-size': getSize(size, 'chip-size'),
        '--chip-radius': radius === undefined ? undefined : getRadius(radius),
        '--chip-checked-padding': getSize(size, 'chip-checked-padding'),
        '--chip-padding': getSize(size, 'chip-padding'),
        '--chip-icon-size': getSize(size, 'chip-icon-size'),
        '--chip-bg': color || variant ? colors.background : undefined,
        '--chip-hover': color || variant ? colors.hover : undefined,
        '--chip-color': color || variant ? colors.color : undefined,
        '--chip-bd': color || variant ? colors.border : undefined,
        '--chip-spacing': getSize(size, 'chip-spacing'),
      },
    }
  },
)

const defaultProps = { size: 'sm', type: 'checkbox', variant: 'filled' } as const

export { varsResolver, defaultProps }
</script>

<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue'
import { assignRef, useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, useProps, useStyles } from '../../core'
import { CheckIcon } from '../Checkbox'
import { useChipGroupContext } from './ChipGroup/ChipGroup'
import type { ChipOwnProps, ChipSlots } from './Chip.types'
import classes from './Chip.module.css'

defineOptions({
  name: 'Chip',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ChipOwnProps>(), {
  modelValue: undefined,
  checked: undefined,
  defaultChecked: undefined,
  autoContrast: undefined,
  // `icon` is tri-state: `undefined` uses the default check icon, `null`/`false` hides it.
  icon: undefined,
  disabled: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

defineSlots<ChipSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Chip', defaultProps, rawProps)

const groupContext = useChipGroupContext()
const uuid = useId(props.id)

const [value, setValue] = useUncontrolled<boolean>({
  value: () => (props.modelValue !== undefined ? props.modelValue : props.checked),
  defaultValue: props.defaultChecked,
  finalValue: false,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('update:checked', nextValue)
    emit('change', nextValue)
  },
})

const getStyles = useStyles({
  name: 'Chip',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const id = computed(() => uuid.value || props.id || '')
const chipValue = computed(() => props.value ?? String(attrs.value ?? ''))

const checked = computed(() =>
  groupContext ? groupContext.isChipSelected(chipValue.value) : value.value,
)

/** Inside a group the input type follows the group's selection mode. */
const inputType = computed(() =>
  groupContext ? (groupContext.multiple ? 'checkbox' : 'radio') : props.type,
)

const icon = computed(() => props.icon ?? slots.icon)
const showIcon = computed(() => checked.value && icon.value !== null && icon.value !== false)

/** Stable functional component: the icon may be a node, a render function or the default. */
const renderIcon = () => {
  const iconProps = getStyles('checkIcon')

  if (icon.value === undefined) {
    return h(CheckIcon, iconProps)
  }

  return typeof icon.value === 'function' ? icon.value(iconProps) : icon.value
}

function setRootRef(node: any) {
  assignRef(props.rootRef, node?.$el ?? node ?? null)
}

function onChange(event: Event) {
  const nextChecked = (event.currentTarget as HTMLInputElement).checked

  if (groupContext) {
    groupContext.onChange(event)
  }

  setValue(nextChecked)
}

/**
 * `class`, `style` and `value` are consumed by the root and the input explicitly, so
 * they are dropped from the object spread onto the input.
 */
const inputAttrs = computed(() => omitAttrs(attrs, ['class', 'style', 'value']))
</script>

<template>
  <Box
    :ref="setRootRef"
    v-bind="{
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
      ...props.wrapperProps,
    }"
    component="div"
    :variant="props.variant"
    :mod="props.mod"
  >
    <input
      v-bind="{ ...inputAttrs, ...getStyles('input') }"
      :id="id"
      :type="inputType"
      :checked="checked"
      :disabled="props.disabled"
      :value="chipValue"
      @change="onChange"
    />

    <Box
      component="label"
      :for="id"
      :variant="props.variant || 'filled'"
      :mod="{ checked, disabled: props.disabled }"
      v-bind="getStyles('label')"
    >
      <span v-if="showIcon" v-bind="getStyles('iconWrapper')">
        <component :is="renderIcon" />
      </span>

      <span><slot /></span>
    </Box>
  </Box>
</template>
