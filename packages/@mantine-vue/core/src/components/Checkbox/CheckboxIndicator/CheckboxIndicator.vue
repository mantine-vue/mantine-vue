<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getSize,
  getThemeColor,
  parseThemeColor,
} from '../../../core'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, variant, autoContrast }) => {
    const parsedColor = parseThemeColor({ color: color || theme.primaryColor, theme })
    const outlineColor =
      parsedColor.isThemeColor && parsedColor.shade === undefined
        ? `var(--mantine-color-${parsedColor.color}-outline)`
        : parsedColor.color
    const lightColors =
      variant === 'light'
        ? theme.variantColorResolver({
            color: color || theme.primaryColor,
            theme,
            variant: 'light',
            autoContrast,
          })
        : undefined
    const resolvedColor =
      variant === 'outline'
        ? outlineColor
        : lightColors
          ? lightColors.color
          : getThemeColor(color, theme)

    return {
      indicator: {
        '--checkbox-size': getSize(size, 'checkbox-size'),
        '--checkbox-radius': radius === undefined ? undefined : getRadius(radius),
        '--checkbox-color': resolvedColor,
        '--checkbox-bg': lightColors?.background,
        '--checkbox-icon-color': iconColor
          ? getThemeColor(iconColor, theme)
          : lightColors
            ? lightColors.color
            : getAutoContrastValue(autoContrast, theme)
              ? getContrastColor({ color, theme, autoContrast })
              : undefined,
      },
    }
  },
)
export { varsResolver }
</script>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useStyles } from '../../../core'
import { CheckboxIcon } from '../CheckIcon'
import { useCheckboxCardContext } from '../CheckboxCard/CheckboxCard'
import type { CheckboxIndicatorOwnProps, CheckboxIndicatorSlots } from './CheckboxIndicator.types'
import classes from './CheckboxIndicator.module.css'

defineOptions({ name: 'CheckboxIndicator', inheritAttrs: false })
const props = withDefaults(defineProps<CheckboxIndicatorOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  size: 'sm',
  radius: 'sm',
  iconColor: undefined,
  autoContrast: undefined,
  icon: undefined,
  checked: undefined,
  indeterminate: undefined,
  variant: 'filled',
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<CheckboxIndicatorSlots>()
const attrs = useAttrs()
const cardContext = useCheckboxCardContext()
const getStyles = useStyles({
  name: 'CheckboxIndicator',
  props,
  classes,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})
const iconStyles = computed(() => getStyles('icon'))
const indeterminate = computed(() =>
  typeof props.indeterminate === 'boolean' ? props.indeterminate : cardContext?.indeterminate,
)
const checked = computed(() =>
  typeof props.checked === 'boolean' || typeof props.indeterminate === 'boolean'
    ? props.checked || props.indeterminate
    : cardContext?.checked || cardContext?.indeterminate || false,
)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{
      ...attrs,
      ...getStyles('indicator', { className: attrs.class, style: attrs.style as any }),
    }"
    :variant="props.variant"
    :mod="[{ checked, indeterminate, disabled: props.disabled }, props.mod]"
  >
    <slot name="icon" v-bind="{ indeterminate, ...iconStyles }">
      <component
        :is="props.icon || CheckboxIcon"
        v-bind="iconStyles"
        :indeterminate="indeterminate"
      />
    </slot>
  </Box>
</template>
