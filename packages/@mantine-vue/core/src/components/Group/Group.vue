<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'
const defaultProps = {
  preventGrowOverflow: true,
  gap: 'md',
  align: 'center',
  justify: 'flex-start',
  wrap: 'wrap',
} as const
const varsResolver = createVarsResolver<any>(
  (_, { grow, preventGrowOverflow, gap, align, justify, wrap }, { childWidth }) => ({
    root: {
      '--group-child-width': grow && preventGrowOverflow ? childWidth : undefined,
      '--group-gap': getSpacing(gap),
      '--group-align': align,
      '--group-justify': justify,
      '--group-wrap': wrap,
    },
  }),
)
export { varsResolver }
</script>

<script setup lang="ts">
import { Comment, h, useAttrs, useSlots, type VNode } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { GroupOwnProps, GroupSlots } from './Group.types'
import classes from './Group.module.css'

defineOptions({ name: 'Group', inheritAttrs: false })
const rawProps = withDefaults(defineProps<GroupOwnProps>(), {
  justify: undefined,
  align: undefined,
  wrap: undefined,
  preventGrowOverflow: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<GroupSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Group', defaultProps, rawProps)
const stylesCtx = { childWidth: '' }
const getStyles = useStyles({
  name: 'Group',
  classes,
  props,
  stylesCtx,
  className: undefined,
  style: undefined,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
/**
 * Functional root keeps slot invocation inside a render function.
 *
 */
const renderGroup = Object.assign(
  (slotProps: { nodes?: () => VNode[] }) => {
    const children = (slotProps.nodes?.() ?? []).filter((child: VNode) => child.type !== Comment)
    const count = Math.max(children.length, 1)
    const gap = getSpacing(props.gap ?? 'md')
    stylesCtx.childWidth = `calc(${100 / count}% - (${gap} - ${gap} / ${count}))`

    return h(
      Box,
      {
        ...attrs,
        ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        mod: { grow: props.grow },
      },
      () => children,
    )
  },
  // Declared so the slot does not fall through onto the root element as an attribute.
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <component :is="renderGroup" :nodes="slots.default" />
</template>
