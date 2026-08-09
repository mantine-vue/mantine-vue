<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'

export const varsResolver = createVarsResolver<any>((_, { separatorMargin }) => ({
  root: { '--bc-separator-margin': getSpacing(separatorMargin) },
}))

const defaultProps = { separator: '/' } as const
</script>

<script setup lang="ts">
import { cloneVNode, Comment, Fragment, h, Text, useAttrs, useSlots, type VNode } from 'vue'
import { Box, resolveNode, useProps, useStyles } from '../../core'
import type { BreadcrumbsOwnProps, BreadcrumbsSlots } from './Breadcrumbs.types'
import classes from './Breadcrumbs.module.css'

defineOptions({ name: 'Breadcrumbs', inheritAttrs: false })

const rawProps = withDefaults(defineProps<BreadcrumbsOwnProps>(), {
  separator: undefined,
  separatorMargin: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<BreadcrumbsSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Breadcrumbs', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Breadcrumbs',
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

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    child.type === Fragment && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : child.type === Comment
        ? []
        : [child],
  )
}

const renderBreadcrumbs = Object.assign(
  (slotProps: { nodes?: () => VNode[] }) => {
    const children = flattenChildren((slotProps.nodes?.() ?? []) as VNode[])
    const items = children.reduce<VNode[]>((acc, child, index) => {
      acc.push(
        child.type === Text
          ? h('div', getStyles('breadcrumb'), child.children as any)
          : cloneVNode(child, getStyles('breadcrumb', { className: (child.props as any)?.class })),
      )

      if (index !== children.length - 1) {
        acc.push(
          h(Box, { ...getStyles('separator'), key: `separator-${index}` }, () =>
            resolveNode(props.separator, slots.separator),
          ),
        )
      }

      return acc
    }, [])

    return h(Box, { ...attrs, ...getStyles('root') }, () => items)
  },
  { props: { nodes: { type: Function, required: false } } },
)
</script>

<template>
  <component :is="renderBreadcrumbs" :nodes="slots.default" />
</template>
