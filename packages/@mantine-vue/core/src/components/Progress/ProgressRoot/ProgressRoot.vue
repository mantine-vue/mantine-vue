<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../../core'

const varsResolver = createVarsResolver<any>((_, { size, radius, transitionDuration }) => ({
  root: {
    '--progress-size': getSize(size, 'progress-size'),
    '--progress-radius': radius === undefined ? undefined : getRadius(radius),
    '--progress-transition-duration':
      typeof transitionDuration === 'number' ? `${transitionDuration}ms` : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import { provideProgressContext } from '../Progress.context'
import type { ProgressRootOwnProps, ProgressRootSlots } from './ProgressRoot.types'
import classes from '../Progress.module.css'

defineOptions({ name: 'ProgressRoot', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ProgressRootOwnProps>(), {
  size: undefined,
  radius: undefined,
  autoContrast: undefined,
  transitionDuration: undefined,
  orientation: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<ProgressRootSlots>()

const attrs = useAttrs()
const props = useProps('ProgressRoot', null, rawProps)
const getStyles = useStyles({
  name: 'Progress',
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

provideProgressContext({ getStyles, autoContrast: props.autoContrast })
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :mod="[{ orientation: props.orientation }, props.mod]"
  >
    <slot />
  </Box>
</template>
