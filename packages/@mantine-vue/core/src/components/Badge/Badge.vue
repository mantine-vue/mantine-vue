<script lang="ts">
import { createVarsResolver, getRadius, getSize, getThemeColor } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, size, autoContrast, circle }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--badge-height': getSize(size, 'badge-height'),
        '--badge-padding-x': getSize(size, 'badge-padding-x'),
        '--badge-fz': getSize(size, 'badge-fz'),
        '--badge-radius': circle || radius === undefined ? undefined : getRadius(radius),
        '--badge-bg': color || variant ? colors.background : undefined,
        '--badge-color': color || variant ? colors.color : undefined,
        '--badge-bd': color || variant ? colors.border : undefined,
        '--badge-dot-color': variant === 'dot' ? getThemeColor(color, theme) : undefined,
      },
    }
  },
)

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type { BadgeOwnProps, BadgeSlots } from './Badge.types'
import classes from './Badge.module.css'

defineOptions({
  name: 'Badge',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<BadgeOwnProps>(), {
  component: 'div',
  // Intentionally undefined to preserve downstream defaults.
  autoContrast: undefined,
  leftSection: undefined,
  rightSection: undefined,
  size: undefined,
  radius: undefined,
  color: undefined,
  gradient: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<BadgeSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Badge', null, rawProps)

const getStyles = useStyles({
  name: 'Badge',
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

const leftSection = computed(() => resolveNode(props.leftSection, slots.leftSection))
const rightSection = computed(() => resolveNode(props.rightSection, slots.rightSection))

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderLeftSection = () => leftSection.value
const renderRightSection = () => rightSection.value

const rootMod = computed(() => [
  {
    block: props.fullWidth,
    circle: props.circle,
    withRightSection: hasNode(rightSection.value),
    withLeftSection: hasNode(leftSection.value),
  },
  (attrs as any).mod,
])
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :variant="props.variant"
    :mod="rootMod"
  >
    <span v-if="hasNode(leftSection)" v-bind="getStyles('section')" data-position="left">
      <component :is="renderLeftSection" />
    </span>
    <span v-bind="getStyles('label')">
      <slot />
    </span>
    <span v-if="hasNode(rightSection)" v-bind="getStyles('section')" data-position="right">
      <component :is="renderRightSection" />
    </span>
  </Box>
</template>
