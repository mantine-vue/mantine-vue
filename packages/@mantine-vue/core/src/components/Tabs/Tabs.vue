<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
} from '../../core'

const defaultProps = {
  keepMounted: true,
  orientation: 'horizontal',
  loop: true,
  activateTabWithKeyboard: true,
  variant: 'default',
  placement: 'left',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { radius, color, autoContrast }) => ({
  root: {
    '--tabs-radius': getRadius(radius),
    '--tabs-color': getThemeColor(color, theme),
    '--tabs-text-color': getAutoContrastValue(autoContrast, theme)
      ? getContrastColor({ color, theme, autoContrast })
      : undefined,
  },
}))

const VALUE_ERROR =
  'Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value'

/**
 * Builds the tab/panel id from a value, failing loudly rather than producing an id of
 * `undefined` that would silently break the `aria-controls` wiring.
 */
function getSafeId(prefix: string) {
  return (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(VALUE_ERROR)
    }

    return `${prefix}-${value}`
  }
}

export { defaultProps, varsResolver, getSafeId, VALUE_ERROR }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { provideTabsContext } from './Tabs.context'
import type { TabsEmits, TabsOwnProps, TabsSlots } from './Tabs.types'
import classes from './Tabs.module.css'

defineOptions({
  name: 'Tabs',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<TabsOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  loop: undefined,
  activateTabWithKeyboard: undefined,
  keepMounted: undefined,
  autoContrast: undefined,
  allowTabDeactivation: false,
  inverted: false,
  unstyled: false,
})

defineSlots<TabsSlots>()

const emit = defineEmits<TabsEmits>()

const attrs = useAttrs()
const props = useProps('Tabs', defaultProps, rawProps)

const uid = useId(props.id)

const [currentTab, setCurrentTab] = useUncontrolled<string | null>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: null,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const getStyles = useStyles({
  name: 'Tabs',
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

/** Getters keep the provided object reactive without changing the shape consumers read. */
provideTabsContext({
  id: uid.value,
  get orientation() {
    return props.orientation
  },
  get loop() {
    return props.loop
  },
  get activateTabWithKeyboard() {
    return props.activateTabWithKeyboard
  },
  get allowTabDeactivation() {
    return props.allowTabDeactivation
  },
  get variant() {
    return props.variant
  },
  get color() {
    return props.color
  },
  get radius() {
    return props.radius
  },
  get inverted() {
    return props.inverted
  },
  get keepMounted() {
    return props.keepMounted
  },
  get placement() {
    return props.placement
  },
  get unstyled() {
    return props.unstyled
  },
  getStyles,
  get value() {
    return currentTab.value
  },
  onChange: setCurrentTab,
  getTabId: getSafeId(`${uid.value}-tab`),
  getPanelId: getSafeId(`${uid.value}-panel`),
} as any)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :id="uid"
    :variant="props.variant"
    :mod="[
      {
        orientation: props.orientation,
        inverted: props.orientation === 'horizontal' && props.inverted,
        placement: props.orientation === 'vertical' && props.placement,
      },
      props.mod,
    ]"
  >
    <slot />
  </Box>
</template>
