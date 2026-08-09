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

    const compactSize =
      typeof size === 'string' && size.includes('compact-') ? size.replace('compact-', '') : size

    return {
      groupSection: {
        '--section-height': getSize(size, 'section-height'),
        '--section-padding-x': getSize(size, 'section-padding-x'),
        '--section-fz': getFontSize(compactSize),
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
  ButtonGroupSectionOwnProps,
  ButtonGroupSectionSlots,
} from './ButtonGroupSection.types'
import classes from '../Button.module.css'

defineOptions({ name: 'ButtonGroupSection', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ButtonGroupSectionOwnProps>(), {
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
defineSlots<ButtonGroupSectionSlots>()

const attrs = useAttrs()
const props = useProps('ButtonGroupSection', null, rawProps)
const getStyles = useStyles({
  name: 'ButtonGroupSection',
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
