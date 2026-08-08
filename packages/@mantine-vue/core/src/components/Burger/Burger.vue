<script lang="ts">
import { createVarsResolver, getSize, getThemeColor, rem } from '../../core'

export const varsResolver = createVarsResolver<any>(
  (theme, { color, size, lineSize, transitionDuration, transitionTimingFunction }) => ({
    root: {
      '--burger-color': color ? getThemeColor(color, theme) : undefined,
      '--burger-size': getSize(size, 'burger-size'),
      '--burger-line-size': lineSize ? rem(lineSize) : undefined,
      '--burger-transition-duration':
        transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
      '--burger-transition-timing-function': transitionTimingFunction,
    },
  }),
)
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import type { BurgerOwnProps, BurgerSlots } from './Burger.types'
import classes from './Burger.module.css'

defineOptions({ name: 'Burger', inheritAttrs: false })

const rawProps = withDefaults(defineProps<BurgerOwnProps>(), {
  size: undefined,
  lineSize: undefined,
  color: undefined,
  opened: false,
  transitionDuration: undefined,
  transitionTimingFunction: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<BurgerSlots>()

const attrs = useAttrs()
const props = useProps('Burger', null, rawProps)
const getStyles = useStyles({
  name: 'Burger',
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
const burgerMod = computed(() => [{ 'reduce-motion': true }, { opened: props.opened }])
</script>

<template>
  <UnstyledButton v-bind="{ ...attrs, ...getStyles('root') }" :unstyled="props.unstyled">
    <Box v-bind="getStyles('burger')" :mod="burgerMod" />
    <slot />
  </UnstyledButton>
</template>
