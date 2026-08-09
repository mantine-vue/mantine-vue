<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'
export const varsResolver = createVarsResolver<any>(
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
        '--ai-size': getSize(size, 'ai-size'),
        '--ai-radius': radius === undefined ? undefined : getRadius(radius),
        '--ai-bg': color || variant ? colors.background : undefined,
        '--ai-hover': color || variant ? colors.hover : undefined,
        '--ai-hover-color': color || variant ? colors.hoverColor : undefined,
        '--ai-color': colors.color,
        '--ai-bd': color || variant ? colors.border : undefined,
      },
    }
  },
)
</script>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { Loader } from '../Loader'
import { Transition as MantineTransition } from '../Transition'
import { UnstyledButton } from '../UnstyledButton'
import type { ActionIconOwnProps, ActionIconSlots } from './ActionIcon.types'
import classes from './ActionIcon.module.css'
defineOptions({ name: 'ActionIcon', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ActionIconOwnProps>(), {
  component: 'button',
  loading: false,
  loaderProps: undefined,
  size: undefined,
  color: undefined,
  radius: undefined,
  gradient: undefined,
  disabled: false,
  autoContrast: undefined,
  variant: undefined,
  __staticSelector: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<ActionIconSlots>()
const attrs = useAttrs()
const props = useProps('ActionIcon', null, rawProps)
const getStyles = useStyles({
  name: props.__staticSelector ?? 'ActionIcon',
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
const rootProps = computed(() => ({
  ...attrs,
  ...getStyles('root', { active: !props.disabled && !props.loading && !attrs['data-disabled'] }),
  component: props.component,
  unstyled: props.unstyled,
  variant: props.variant,
  size: props.size,
  disabled: props.disabled || props.loading,
  'aria-busy': props.loading || undefined,
  mod: [
    { loading: props.loading, disabled: props.disabled || Boolean(attrs['data-disabled']) },
    (attrs as any).mod,
  ],
}))
</script>
<template>
  <UnstyledButton v-bind="rootProps">
    <MantineTransition
      :mounted="props.loading"
      transition="slide-down"
      :duration="150"
      v-slot="transitionStyles"
    >
      <Box
        component="span"
        v-bind="getStyles('loader', { style: transitionStyles })"
        aria-hidden="true"
      >
        <Loader
          color="var(--ai-color)"
          size="calc(var(--ai-size) * 0.55)"
          v-bind="props.loaderProps"
        />
      </Box>
    </MantineTransition>
    <Box component="span" :mod="{ loading: props.loading }" v-bind="getStyles('icon')"
      ><slot
    /></Box>
  </UnstyledButton>
</template>
