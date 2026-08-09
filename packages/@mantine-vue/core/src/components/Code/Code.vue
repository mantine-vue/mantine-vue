<script lang="ts">
import { createVarsResolver, getThemeColor } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--code-bg': color ? getThemeColor(color, theme) : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { CodeOwnProps, CodeSlots } from './Code.types'
import classes from './Code.module.css'

defineOptions({
  name: 'Code',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CodeOwnProps>(), {
  color: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<CodeSlots>()

const attrs = useAttrs()

const props = useProps('Code', null, rawProps)

const getStyles = useStyles({
  name: 'Code',
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
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.block ? 'pre' : 'code'"
    :mod="[{ block: props.block }, (attrs as any).mod]"
    dir="ltr"
  >
    <slot />
  </Box>
</template>
