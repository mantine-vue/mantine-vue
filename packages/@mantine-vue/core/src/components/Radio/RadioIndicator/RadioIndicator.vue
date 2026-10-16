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
        '--radio-size': getSize(size, 'radio-size'),
        '--radio-radius': radius === undefined ? undefined : getRadius(radius),
        '--radio-color': resolvedColor,
        '--radio-bg': lightColors?.background,
        '--radio-icon-size':
          typeof size === 'number'
            ? `calc(${getSize(size, 'radio-size')} * 0.4)`
            : getSize(size, 'radio-icon-size'),
        '--radio-icon-color': iconColor
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
import { RadioIcon } from '../RadioIcon'
import { useRadioCardContext } from '../RadioCard/RadioCard'
import type { RadioIndicatorOwnProps, RadioIndicatorSlots } from './RadioIndicator.types'
import classes from './RadioIndicator.module.css'

defineOptions({ name: 'RadioIndicator', inheritAttrs: false })
const props = withDefaults(defineProps<RadioIndicatorOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  size: 'sm',
  radius: undefined,
  iconColor: undefined,
  autoContrast: undefined,
  icon: undefined,
  checked: undefined,
  variant: 'filled',
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<RadioIndicatorSlots>()
const attrs = useAttrs()
const cardContext = useRadioCardContext()
const getStyles = useStyles({
  name: 'RadioIndicator',
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
const iconStyles = computed(() => getStyles('icon'))
const checked = computed(() =>
  typeof props.checked === 'boolean' ? props.checked : cardContext?.checked || false,
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
    :mod="[{ checked, disabled: props.disabled }, props.mod]"
  >
    <slot name="icon" v-bind="iconStyles">
      <component :is="props.icon || RadioIcon" v-bind="iconStyles" />
    </slot>
  </Box>
</template>
