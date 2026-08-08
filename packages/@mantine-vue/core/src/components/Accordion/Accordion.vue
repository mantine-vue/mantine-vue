<script lang="ts">
import type { VNodeChild } from 'vue'
import { createVarsResolver, getRadius, rem } from '../../core'

const VALUE_ERROR = 'Accordion.Item component was rendered with invalid value or without value'

const defaultProps = {
  multiple: false,
  loop: true,
  disableChevronRotation: false,
  disableCollapse: false,
  chevronPosition: 'right',
  variant: 'default',
  chevronSize: 'auto',
  chevronIconSize: 16,
} as const

/**
 * Builds the control/panel id from an item value, failing loudly rather than producing
 * an id of `undefined` that would silently break the `aria-controls` wiring.
 */
function getSafeId(prefix: string) {
  return (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(VALUE_ERROR)
    }

    return `${prefix}-${value}`
  }
}

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { transitionDuration, chevronSize, radius }) => ({
  root: {
    '--accordion-transition-duration':
      transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
    '--accordion-chevron-size': chevronSize === undefined ? undefined : rem(chevronSize),
    '--accordion-radius': radius === undefined ? undefined : getRadius(radius),
  },
}))

/** The default slot may be a function or already-rendered children. */
function renderContent(content: any): VNodeChild {
  return typeof content === 'function' ? content() : content
}

export { VALUE_ERROR, defaultProps, getSafeId, varsResolver, renderContent }
</script>

<script setup lang="ts">
import { computed, h, reactive, useAttrs, useSlots } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { AccordionChevron } from './AccordionChevron'
import { provideAccordionContext } from './Accordion.context'
import type { AccordionOwnProps, AccordionSlots } from './Accordion.types'
import classes from './Accordion.module.css'

defineOptions({
  name: 'Accordion',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<AccordionOwnProps>(), {
  multiple: undefined,
  value: undefined,
  defaultValue: undefined,
  loop: undefined,
  disableChevronRotation: undefined,
  disableCollapse: undefined,
  keepMounted: undefined,
  chevron: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  'update:value': [value: string | string[] | null]
  change: [value: string | string[] | null]
}>()

defineSlots<AccordionSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Accordion', defaultProps, rawProps)

const uid = useId(props.id)

const [currentValue, setCurrentValue] = useUncontrolled<string | string[] | null>({
  value: () => props.value,
  defaultValue: props.defaultValue,
  finalValue: props.multiple ? [] : null,
  onChange: (value) => {
    emit('update:value', value)
    emit('change', value)
  },
})

const getStyles = useStyles({
  name: 'Accordion',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

function isItemActive(itemValue: string) {
  return Array.isArray(currentValue.value)
    ? currentValue.value.includes(itemValue)
    : itemValue === currentValue.value
}

function handleItemChange(itemValue: string) {
  const value = currentValue.value

  // `disableCollapse` only applies to single mode; in `multiple` mode an item can
  // always be toggled off.
  if (!Array.isArray(value) && props.disableCollapse && itemValue === value) {
    return
  }

  const nextValue = Array.isArray(value)
    ? value.includes(itemValue)
      ? value.filter((selectedValue) => selectedValue !== itemValue)
      : [...value, itemValue]
    : itemValue === value
      ? null
      : itemValue

  setCurrentValue(nextValue)
}

/** `reactive` over getters: the controls read these values during their own render. */
provideAccordionContext(
  reactive({
    get loop() {
      return props.loop
    },
    get transitionDuration() {
      return props.transitionDuration
    },
    get disableChevronRotation() {
      return props.disableChevronRotation
    },
    get chevronPosition() {
      return props.chevronPosition
    },
    get order() {
      return props.order
    },
    get chevron() {
      // An explicit `null` removes the chevron; otherwise prop, then slot, then default.
      if (props.chevron === null) {
        return null
      }

      return (
        props.chevron ??
        slots.chevron ??
        (() => h(AccordionChevron, { size: props.chevronIconSize }))
      )
    },
    onChange: handleItemChange,
    isItemActive,
    get getControlId() {
      return getSafeId(`${uid.value}-control`)
    },
    get getRegionId() {
      return getSafeId(`${uid.value}-panel`)
    },
    getStyles,
    get variant() {
      return props.variant
    },
    get unstyled() {
      return props.unstyled
    },
    get keepMounted() {
      return props.keepMounted
    },
  }) as any,
)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

const renderDefault = Object.assign(
  (slotProps: { nodes?: () => VNodeChild }) => renderContent(slotProps.nodes as any),
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :id="uid"
    :variant="props.variant"
    :data-accordion="true"
  >
    <component :is="renderDefault" :nodes="slots.default" />
  </Box>
</template>
