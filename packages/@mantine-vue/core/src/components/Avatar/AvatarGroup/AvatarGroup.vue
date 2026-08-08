<script lang="ts">
import { createVarsResolver, getSpacing } from '../../../core'
export const varsResolver = createVarsResolver<any>((_, { spacing }) => ({
  group: { '--ag-spacing': getSpacing(spacing) },
}))
</script>
<script setup lang="ts">
import { provide, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../../core'
import { AvatarGroupContextKey } from './AvatarGroup.context'
import type { AvatarGroupOwnProps, AvatarGroupSlots } from './AvatarGroup.types'
import classes from '../Avatar.module.css'
defineOptions({ name: 'AvatarGroup', inheritAttrs: false })
const rawProps = withDefaults(defineProps<AvatarGroupOwnProps>(), {
  spacing: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<AvatarGroupSlots>()
const attrs = useAttrs()
const props = useProps('AvatarGroup', null, rawProps)
const getStyles = useStyles({
  name: 'AvatarGroup',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
  rootSelector: 'group',
})
provide(AvatarGroupContextKey, { withinGroup: true })
</script>
<template>
  <Box v-bind="{ ...attrs, ...getStyles('group') }"><slot /></Box>
</template>
