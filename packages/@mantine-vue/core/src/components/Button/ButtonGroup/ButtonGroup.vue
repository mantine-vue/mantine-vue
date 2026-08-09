<script lang="ts">
import { createVarsResolver, rem } from '../../../core'

const defaultProps = { orientation: 'horizontal' } as const
const varsResolver = createVarsResolver<any>((_, { borderWidth }) => ({
  group: { '--button-border-width': rem(borderWidth) },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import type { ButtonGroupOwnProps, ButtonGroupSlots } from './ButtonGroup.types'
import classes from '../Button.module.css'

defineOptions({ name: 'ButtonGroup', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ButtonGroupOwnProps>(), {
  orientation: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<ButtonGroupSlots>()
const attrs = useAttrs()
const props = useProps('ButtonGroup', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'ButtonGroup',
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
  <Box
    v-bind="{ ...attrs, ...getStyles('group') }"
    role="group"
    :mod="[{ orientation: props.orientation }, (attrs as any).mod]"
    ><slot
  /></Box>
</template>
