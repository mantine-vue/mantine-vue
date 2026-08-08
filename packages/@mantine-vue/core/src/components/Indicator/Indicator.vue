<script lang="ts">
import {
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
  rem,
} from '../../core'
import { getPositionVariables } from './get-position-variables/get-position-variables'

const defaultProps = { position: 'top-end', offset: 0, showZero: true, zIndex: 200 } as const
const varsResolver = createVarsResolver<any>(
  (theme, { color, position, offset, size, radius, zIndex, autoContrast }) => ({
    root: {
      '--indicator-color': color ? getThemeColor(color, theme) : undefined,
      '--indicator-text-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
      '--indicator-size': rem(size),
      '--indicator-radius': radius === undefined ? undefined : getRadius(radius),
      '--indicator-z-index': zIndex?.toString(),
      ...getPositionVariables(position, offset),
    },
  }),
)
export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type { IndicatorOwnProps, IndicatorSlots } from './Indicator.types'
import classes from './Indicator.module.css'

defineOptions({ name: 'Indicator', inheritAttrs: false })
const rawProps = withDefaults(defineProps<IndicatorOwnProps>(), {
  position: undefined,
  offset: undefined,
  label: undefined,
  color: undefined,
  autoContrast: undefined,
  maxValue: undefined,
  showZero: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<IndicatorSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Indicator', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Indicator',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
const labelContent = computed(() => resolveNode(props.label, slots.label))
const shouldHideZero = computed(() => !props.showZero && (props.label === 0 || props.label === '0'))
const formattedLabel = computed(() =>
  props.maxValue !== undefined && typeof props.label === 'number' && props.label > props.maxValue
    ? `${props.maxValue}+`
    : labelContent.value,
)
const renderLabel = () => formattedLabel.value
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }" :mod="[{ inline: props.inline }, props.mod]">
    <Box
      v-if="!props.disabled && !shouldHideZero"
      v-bind="getStyles('indicator')"
      :mod="{
        withLabel: hasNode(labelContent),
        withBorder: props.withBorder,
        processing: props.processing,
      }"
      ><component :is="renderLabel"
    /></Box>
    <slot />
  </Box>
</template>
