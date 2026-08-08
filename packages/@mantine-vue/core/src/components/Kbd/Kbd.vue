<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: { '--kbd-fz': getSize(size, 'kbd-fz') },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { KbdOwnProps, KbdSlots } from './Kbd.types'
import classes from './Kbd.module.css'

defineOptions({
  name: 'Kbd',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<KbdOwnProps>(), {
  size: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<KbdSlots>()

const attrs = useAttrs()

const props = useProps('Kbd', null, rawProps)

const getStyles = useStyles({
  name: 'Kbd',
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
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }" component="kbd">
    <slot />
  </Box>
</template>
