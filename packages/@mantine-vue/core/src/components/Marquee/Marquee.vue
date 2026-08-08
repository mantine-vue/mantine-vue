<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'

export const varsResolver = createVarsResolver<any>(
  (_, { duration, gap, repeat, fadeEdgeColor, fadeEdgeSize }) => ({
    root: {
      '--marquee-duration': `${duration}ms`,
      '--marquee-gap': getSpacing(gap),
      '--marquee-repeat': (repeat ?? 4).toString(),
      '--marquee-fade-color': fadeEdgeColor,
      '--marquee-fade-size': fadeEdgeSize,
    },
  }),
)

const defaultProps = {
  repeat: 4,
  duration: 100000,
  orientation: 'horizontal',
  fadeEdges: true,
} as const
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { MarqueeOwnProps, MarqueeSlots } from './Marquee.types'
import classes from './Marquee.module.css'

defineOptions({ name: 'Marquee', inheritAttrs: false })

const rawProps = withDefaults(defineProps<MarqueeOwnProps>(), {
  reverse: false,
  pauseOnHover: false,
  orientation: undefined,
  repeat: undefined,
  duration: undefined,
  gap: undefined,
  fadeEdges: undefined,
  fadeEdgeColor: undefined,
  fadeEdgeSize: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<MarqueeSlots>()

const attrs = useAttrs()
const props = useProps('Marquee', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Marquee',
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
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :mod="[
      {
        orientation: props.orientation,
        reverse: props.reverse,
        pauseOnHover: props.pauseOnHover,
        'fade-edges': props.fadeEdges,
      },
      props.mod,
    ]"
  >
    <div v-bind="getStyles('content')">
      <div v-for="index in props.repeat" :key="index" v-bind="getStyles('group')">
        <slot />
      </div>
    </div>
  </Box>
</template>
