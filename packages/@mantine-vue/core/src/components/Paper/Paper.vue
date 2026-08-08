<script lang="ts">
import { createVarsResolver, getRadius, getShadow } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { radius, shadow }) => ({
  root: {
    '--paper-radius': radius === undefined ? undefined : getRadius(radius),
    '--paper-shadow': getShadow(shadow),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { Box, useForwardedRef, useProps, useStyles } from '../../core'
import type { PaperOwnProps, PaperSlots } from './Paper.types'
import classes from './Paper.module.css'

defineOptions({
  name: 'Paper',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<PaperOwnProps>(), {
  component: 'div',
  shadow: undefined,
  radius: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<PaperSlots>()

const attrs = useAttrs()

const props = useProps('Paper', null, rawProps)

const getStyles = useStyles({
  name: 'Paper',
  classes,
  props,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

const elementRef = ref<HTMLElement | null>(null)
useForwardedRef(elementRef)
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    ref="elementRef"
    :component="props.component"
    :mod="[{ 'with-border': props.withBorder }, (attrs as any).mod]"
  >
    <slot />
  </Box>
</template>
