<script lang="ts">
import { createVarsResolver, rem } from '../../../core'

const defaultProps = { orientation: 'horizontal' } as const
const varsResolver = createVarsResolver<any>((_, { borderWidth }) => ({
  group: { '--ai-border-width': rem(borderWidth) },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import type { ActionIconGroupOwnProps, ActionIconGroupSlots } from './ActionIconGroup.types'
import classes from '../ActionIcon.module.css'

defineOptions({ name: 'ActionIconGroup', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ActionIconGroupOwnProps>(), {
  orientation: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<ActionIconGroupSlots>()
const attrs = useAttrs()
const props = useProps('ActionIconGroup', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'ActionIconGroup',
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
