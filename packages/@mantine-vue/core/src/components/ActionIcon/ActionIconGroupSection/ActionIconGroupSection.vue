<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, getSize } from '../../../core'

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, autoContrast, size }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      groupSection: {
        '--section-height': getSize(size, 'section-height'),
        '--section-padding-x': getSize(size, 'section-padding-x'),
        '--section-fz': getFontSize(size),
        '--section-radius': radius === undefined ? undefined : getRadius(radius),
        '--section-bg': color || variant ? colors.background : undefined,
        '--section-color': colors.color,
        '--section-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import type {
  ActionIconGroupSectionOwnProps,
  ActionIconGroupSectionSlots,
} from './ActionIconGroupSection.types'
import classes from '../ActionIcon.module.css'

defineOptions({ name: 'ActionIconGroupSection', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ActionIconGroupSectionOwnProps>(), {
  size: undefined,
  color: undefined,
  radius: undefined,
  gradient: undefined,
  autoContrast: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})
defineSlots<ActionIconGroupSectionSlots>()

const attrs = useAttrs()
const props = useProps('ActionIconGroupSection', null, rawProps)
const getStyles = useStyles({
  name: 'ActionIconGroupSection',
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
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('groupSection') }" :variant="props.variant">
    <slot />
  </Box>
</template>
