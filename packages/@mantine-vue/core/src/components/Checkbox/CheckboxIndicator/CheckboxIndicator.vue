<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getSize,
  getThemeColor,
} from '../../../core'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, size, iconColor, autoContrast }) => ({
    indicator: {
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
  typeof props.checked === 'boolean' || props.indeterminate
    ? props.checked || props.indeterminate
    : cardContext?.checked || false,
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
    :mod="[{ checked, indeterminate: props.indeterminate, disabled: props.disabled }, props.mod]"
  >
    <slot name="icon" v-bind="{ indeterminate: props.indeterminate, ...iconStyles }">
      <component
        :is="props.icon || CheckboxIcon"
        v-bind="iconStyles"
        :indeterminate="props.indeterminate"
      />
    </slot>
  </Box>
</template>
