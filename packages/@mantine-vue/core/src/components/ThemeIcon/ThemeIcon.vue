<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, variant, gradient, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--ti-size': getSize(size, 'ti-size'),
        '--ti-radius': radius === undefined ? undefined : getRadius(radius),
        '--ti-bg': color || variant ? colors.background : undefined,
        '--ti-color': color || variant ? colors.color : undefined,
        '--ti-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { ThemeIconOwnProps, ThemeIconSlots } from './ThemeIcon.types'
import classes from './ThemeIcon.module.css'

defineOptions({
  name: 'ThemeIcon',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ThemeIconOwnProps>(), {
  rootRef: undefined,
  // Intentionally undefined to preserve downstream defaults.
  autoContrast: undefined,
  size: undefined,
  color: undefined,
  radius: undefined,
  gradient: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ThemeIconSlots>()

const attrs = useAttrs()

const props = useProps('ThemeIcon', null, rawProps)

const getStyles = useStyles({
  name: 'ThemeIcon',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box :rootRef="setRootRef" v-bind="{ ...attrs, ...getStyles('root') }" :variant="props.variant">
    <slot />
  </Box>
</template>
