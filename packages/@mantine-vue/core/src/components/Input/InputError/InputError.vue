<script lang="ts">
import { createVarsResolver, getFontSize, rem } from '../../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  error: {
    '--input-error-size': size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import { useInputWrapperContext } from '../InputWrapper.context'
import type { InputErrorOwnProps, InputErrorSlots } from './InputError.types'
import classes from '../Input.module.css'

defineOptions({
  name: 'InputError',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<InputErrorOwnProps>(), {
  __inheritStyles: true,
  unstyled: false,
})

defineSlots<InputErrorSlots>()

const attrs = useAttrs()
const props = useProps('InputError', null, rawProps)

const wrapperCtx = useInputWrapperContext()

const ownGetStyles = useStyles({
  name: 'InputWrapper',
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

const errorStyles = computed(() => {
  const getStyles = (props.__inheritStyles && wrapperCtx.getStyles) || ownGetStyles
  return getStyles('error', { className: attrs.class, style: attrs.style as any, props })
})
</script>

<template>
  <Box v-bind="{ ...attrs, ...errorStyles }" component="p">
    <slot />
  </Box>
</template>
