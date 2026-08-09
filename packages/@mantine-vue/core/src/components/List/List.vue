<script lang="ts">
import { createVarsResolver, getFontSize, getLineHeight, getSpacing } from '../../core'
export const varsResolver = createVarsResolver<any>((_, { size, spacing }) => ({
  root: {
    '--list-fz': getFontSize(size),
    '--list-lh': getLineHeight(size),
    '--list-spacing': getSpacing(spacing),
  },
}))
const defaultProps = { type: 'unordered' } as const
</script>
<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import { provideListContext } from './List.context'
import type { ListOwnProps, ListSlots } from './List.types'
import classes from './List.module.css'
defineOptions({ name: 'List', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ListOwnProps>(), {
  type: undefined,
  withPadding: false,
  size: undefined,
  icon: undefined,
  spacing: undefined,
  center: false,
  listStyleType: undefined,
  start: undefined,
  reversed: false,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<ListSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('List', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'List',
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
const getIcon = () => resolveNode(props.icon, slots.icon)
provideListContext({
  getStyles,
  get center() {
    return props.center
  },
  get icon() {
    return getIcon()
  },
})
const getMod = () => [
  { withPadding: props.withPadding, type: hasNode(getIcon()) ? 'none' : props.listStyleType },
  props.mod,
]
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root', { style: { listStyleType: props.listStyleType } }) }"
    :component="props.type === 'unordered' ? 'ul' : 'ol'"
    :start="props.type === 'ordered' ? props.start : undefined"
    :reversed="props.type === 'ordered' && props.reversed ? '' : undefined"
    :mod="getMod()"
    ><slot
  /></Box>
</template>
